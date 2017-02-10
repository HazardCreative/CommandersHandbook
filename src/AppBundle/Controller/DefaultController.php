<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Form\EditProfileType;
use AppBundle\Entity\FrameCompany;

class DefaultController extends Controller {
	/**
	 * @Route("/", name="homepage")
	 */
	public function indexAction() {
		return $this->render('mfzch/mfzch.html.twig');
	}

	/**
	 * @Route("/command-network", name="command-home")
	 */
	public function commandNetworkAction() {
		return $this->render('mfzch/pages/command-home.html.twig');
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

	/**
	 * @Route("/manage-conflicts", name="manage-conflicts")
	 */
	public function manageConflictsAction(Request $request) {
		$user = $this->get('security.token_storage')->getToken()->getUser();

		$games_repo = $this->getDoctrine()
			->getRepository('AppBundle:RAGame');

		$games = $games_repo->findByOwner($user->getId());

        return $this->render('manage-conflicts.html.twig', array(
			'games' => $games
		));
	}

	/**
	 * @Route("/manage-companies", name="manage-companies")
	 */
	public function manageCompaniesAction(Request $request) {
		$user = $this->get('security.token_storage')->getToken()->getUser();

		$companies_repo = $this->getDoctrine()
			->getRepository('AppBundle:FrameCompany');

		$companies = $companies_repo->findByOwner($user->getId());

        return $this->render('manage-companies.html.twig', array(
			'companies' => $companies
		));
	}

	/**
	 * @Route("/save-data", name="save-data")
	 */
	public function saveDataAction() {
		$success_check = true;

		$auth_checker = $this->get('security.authorization_checker');

		if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
			$user = $this->get('security.token_storage')->getToken()->getUser();

	//		var_dump($_REQUEST); die();

			$result = [];
			if ($_REQUEST['mfz_companies']) {
				$data = json_decode($_REQUEST['mfz_companies']);

				$companies_repo = $this->getDoctrine()
					->getRepository('AppBundle:FrameCompany');

				foreach($data as $incoming) {

					if (!$dbresult = $companies_repo->findById($incoming->id)) {
						$company = new FrameCompany();
					} else {
						$company = $dbresult[0];
					}

					$company->setTitle($incoming->name);
	//				$company->setDescription();
					$company->setOwner($user->getId());
					$company->setHexcolor($incoming->color);
					$company->setFrames($incoming->frames);
	//				$company->setIsShared();
					$company->setDateModified(new \DateTime());

					try {
						$em = $this->getDoctrine()->getManager();
						$em->persist($company);
						$em->flush();

						$result[] = ['id' => $company->getId()];
					} catch (Exception $e) {
						$success_check = false;
					}
				}
			}

			if ($success_check) {
				return new JsonResponse($result);
//				return new Response('', Response::HTTP_OK); // 200
			} else {
				return new Response('', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
			}
		} else {
			return new Response('Auth Failure', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
		}
	}

	/**
	 * @Route("/load-data", name="load-data")
	 */
	public function loadDataAction() {
		$auth_checker = $this->get('security.authorization_checker');

		if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
			$user = $this->get('security.token_storage')->getToken()->getUser();

				$companies_repo = $this->getDoctrine()
					->getRepository('AppBundle:FrameCompany');

				$companies = $companies_repo->findByOwner($user->getId());

				$output = [];
				foreach ($companies as $company) {
					$o = [];
					$o['id'] = $company->getId();
					$o['name'] = $company->getTitle();
					$o['description'] = $company->getDescription();
					$o['owner'] = $user->getUsername();
					$o['color'] = $company->getHexcolor();
					$o['frames'] = $company->getFrames();
					$o['shared'] = $company->getIsShared();
					$o['created'] = $company->getDateCreated();
					$o['modified'] = $company->getDateModified();
					$output[] = $o;
				}

				return new JsonResponse($output);

		} else {
			return new Response('Auth Failure', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
		}
	}
}
