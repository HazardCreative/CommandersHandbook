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
	public function indexAction() {
		return $this->render('mfzch/mfzch.html.twig');
	}

	/**
	 * @Route("/view-profile/{username}", name="view-profile-public")
	 */
	public function viewPublicProfileAction($username) {
		$userManager = $this->get('fos_user.user_manager');
		$user = $userManager->findUserByUsername($username);

		return $this->render('view-public-profile.html.twig',
			array('user' => $user));
	}

	/**
	 * @Route("/view-profile", name="view-profile")
	 */
	public function viewProfileAction() {
		// $user = $this->get('security.token_storage')->getToken()->getUser();
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
        $userManager = $this->get('fos_user.user_manager');
        $users = $userManager->findUsers();

        return $this->render('player-finder.html.twig', array('users' => $users));
	}
}
