<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\PatreonConnect\PatreonConnect;
use App\Entity\User\User;

class PatreonController extends Controller {
	/**
	 * @Route("/patreon-connect", name="patreon-connect")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function patreonGetClientAction(
		Request $request,
		PatreonConnect $PatreonConnect,
		User $user = null) {

		$errors = [];

		$pc = $PatreonConnect;
		$pc_tokens = $pc->getTokens($request->query->get('code'));

		if (isset($pc_tokens['access_token']) && $pc_tokens['access_token']) {
			$user->setPatreonTokens($pc_tokens);

			$patron = $pc->getUser($pc_tokens['access_token']);

			if ($patron) {
				if (isset($patron['id'])) {
					$user->setPatreonData($patron['data']);
				}

				if (isset($patron['id'])) {
					$user->setPatreonId($patron['id']);
				}

				if (isset($patron['included'][0])) {
					$pledge = $patron['included'][0];
					$user->setPatreonPledges($pledge);

					$user->updateEliteStatus();
				} else {
					// no 'included'
					$errors[] = 'Patreon did not provide any pledge information for this app.';
				}

			} else {
				// no patron
				$errors[] = 'Patreon API did not return a valid account.';
			}
		} else {
			// no tokens
			$errors[] = 'Access tokens for Patron API were not provided by Patreon.';
		}

		// write to DB
		$em = $this->getDoctrine()->getManager();
		$em->persist($user);
		$em->flush();

		if (count($errors)) {
			// errors
			return $this->render('patreon-fail.html.twig', array(
				'errors' => $errors,
				'patreonLoginURL' => $pc->getLoginURL(),
			));
		} else {
			// success
			return $this->render('patreon-connect.html.twig', array(
				'patreonLoginURL' => $pc->getLoginURL(),
			));
		}
	}

	/**
	 * @Route("/patreon-update", name="patreon-update")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function patreonRefreshClientAction(
		Request $request,
		PatreonConnect $PatreonConnect,
		User $user = null) {

		$errors = [];

		$pc = $PatreonConnect;
		$pc_tokens = $user->getPatreonTokens();

		if (isset($pc_tokens['access_token']) && $pc_tokens['access_token']) {
			$patron = $pc->getUser($pc_tokens['access_token']);

			if ($patron['errors']) {
				$pc_tokens = $pc->refreshTokens($pc_tokens['refresh_token']);

				if (isset($pc_tokens['access_token']) && $pc_tokens['access_token']) {
					$user->setPatreonTokens($pc_tokens);
					$patron = $pc->getUser($pc_tokens['access_token']);
				} else {
					// no tokens
					$errors[] = 'Error trying to update Patreon account information: Access tokens for Patron API were not provided by Patreon.';
				}
			}

			if ($patron) {
				if (isset($patron['id'])) {
					$user->setPatreonData($patron['data']);
				}

				if (isset($patron['id'])) {
					$user->setPatreonId($patron['id']);
				}

				if (isset($patron['included'][0])) {
					$pledge = $patron['included'][0];
					$user->setPatreonPledges($pledge);

					$user->updateEliteStatus();
				} else {
					// no 'included'
					$errors[] = 'Error trying to update Patreon account information: Patreon did not provide any pledge information for this app.';
				}
			} else {
				// no patron
				$errors[] = 'Error trying to update Patreon account information: Patreon API did not return a valid account.';
			}
		} else {
			// no tokens
			$errors[] = 'Error trying to update Patreon account information: Access tokens for Patron API were not provided by Patreon.';
		}

		// write to DB
		$em = $this->getDoctrine()->getManager();
		$em->persist($user);
		$em->flush();

		return $this->render('mfzch/mfzch.html.twig', array(
			'errors' => $errors
		));
	}

	/**
	 * @Route("/remove-patreon", name="remove-patreon")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function patreonDeleteAction(
		Request $request,
		User $user = null) {

		$user->setPatreonTokens(null);
		$user->setPatreonData(null);
		$user->setPatreonId(null);
		$user->setPatreonPledges(null);

		// write to DB
		$em = $this->getDoctrine()->getManager();
		$em->persist($user);
		$em->flush();

		return $this->redirectToRoute('/command-network');
	}

}
