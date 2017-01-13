<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PatreonController extends Controller {
	/**
	 * @Route("/patreon-test", name="patreon-test")
	 */
	public function patreonGetClientAction(Request $request) {

		$pc = $this->get('patreon.connect');
		$pc_data = $pc->patreonGetClient($request->query->get('code'));

		$user = $this->get('security.token_storage')->getToken()->getUser();
		$user->setPatreonData($pc_data['patreon_data']);
		if ($pc_data['patreon_data']['user_response']['data']['id']) {
			$user->setPatreonId($pc_data['patreon_data']['user_response']['data']['id']);
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
