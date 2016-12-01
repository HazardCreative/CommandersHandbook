<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Form\EditProfileType;

class DefaultController extends Controller
{
	/**
	 * @Route("/", name="homepage")
	 */
	public function indexAction(Request $request) {
		return $this->render('mfzch/mfzch.html.twig', array(
		'buildver' => 2016113000,
		'buildstring' => 'v2016.11.30',
//		'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
		));
	}

	/**
	 * @Route("/view-profile", name="view-profile")
	 */
	public function viewProfileAction(Request $request) {
		$user = $this->get('security.token_storage')->getToken()->getUser();
		return $this->render('view-profile.html.twig');
	}

	/**
	 * @Route("/edit-profile", name="edit-profile")
	 */
	public function editProfileAction(Request $request) {
		$user = $this->get('security.token_storage')->getToken()->getUser();

		$form = $this->createForm(EditProfileType::class, $user);

		$form->handleRequest($request);

		if ($form->isSubmitted() && $form->isValid()) {
			$user = $form->getData();

			$em = $this->getDoctrine()->getManager();
			$em->persist($user);
			$em->flush();

			return $this->redirectToRoute('view-profile');
		}

		return $this->render('edit-profile.html.twig', array(
			'form' => $form->createView()
		));
	}

	/**
	 * @Route("/player-finder", name="player-finder")
	 */
	public function playerFinderAction(Request $request) {
		$user = $this->get('security.token_storage')->getToken()->getUser();

        $userManager = $this->get('fos_user.user_manager');
        $users = $userManager->findUsers();

        return $this->render('player-finder.html.twig', array('users' => $users));
	}
}
