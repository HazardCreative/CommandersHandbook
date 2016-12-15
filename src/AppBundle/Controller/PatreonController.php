<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PatreonController extends Controller
{
	/**
	 * @Route("/patreon-test", name="patreon-test")
	 */
	public function patreonGetClientAction(Request $request) {

		$pc = $this->get('patreon.connect');
		$pc_data = $pc->patreonGetClient($request->query->get('code'));

        return $this->render('patreon-test.html.twig', array(
			'patreon_data' => $pc_data,
		));
	}
}
