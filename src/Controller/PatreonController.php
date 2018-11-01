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
	 * @Route("/patreon-test", name="patreon-test")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function patreonGetClientAction(
			Request $request,
			PatreonConnect $PatreonConnect,
			User $user = null) {

		$pc = $PatreonConnect;
		$pc_data = $pc->patreonGetClient($request->query->get('code'));

		$user->setPatreonData($pc_data['patreon_data']);

		if (isset($pc_data['patreon_data']['user_id'])) {
			$user->setPatreonId($pc_data['patreon_data']['user_id']);
		}

		if (isset($pc_data['patreon_data']['tokens'])) {
			$user->setPatreonTokens($pc_data['patreon_data']['tokens']);
		}

		if (isset($pc_data['patreon_data']['pledge'])) {
			$user->setPatreonPledges($pc_data['patreon_data']['pledge']);
		}

		// write to DB
		$em = $this->getDoctrine()->getManager();
		$em->persist($user);
		$em->flush();

		return $this->render('patreon-test.html.twig', array(
			'patreon_data' => $pc_data,
			'redirect_url' => $pc->redirect_url,
		));
	}
}
