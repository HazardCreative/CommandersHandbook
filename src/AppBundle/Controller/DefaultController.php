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
        return $this->render('player-finder.html.twig');
	}

	/**
	 * @Route("/get-players", name="get-players")
	 */
	public function getPlayersAction(Request $request) {

		if ($_REQUEST['data']) {
			$data = json_decode($_REQUEST['data']);

			// Get closest
			$user = $this->get('security.token_storage')->getToken()->getUser();

			$query = $this->getDoctrine()->getEntityManager()
				->createQuery(
					'SELECT u FROM AppBundle:User u
					WHERE u.geo_latitude > :latmin
					AND u.geo_latitude < :latmax
					AND u.geo_longitude > :longmin
					AND u.geo_longitude < :longmax
					AND u.profile_is_public = true'
				)->setParameter('latmin', $data->lat -1)
				->setParameter('latmax', $data->lat +1)
				->setParameter('longmin', $data->lng -1)
				->setParameter('longmax', $data->lng +1);

			$queryResult = $query->getResult();

			$userOutput = [];
			foreach ($queryResult as $userObj) {
				$thisUser['username'] = $userObj->getUsername();
				$thisUser['geo_latitude'] = $userObj->getGeoLatitude();
				$thisUser['geo_longitude'] = $userObj->getGeoLongitude();
				$thisUser['link'] = $this->generateUrl('view-profile-public', array('username' => $userObj->getUsername()));

				$userOutput[] = $thisUser;
			}

			return new JsonResponse($userOutput);

		} else {
			return new Response('', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
		}
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
			if ($_REQUEST['company']) {
				$data = json_decode($_REQUEST['company']);

				$companies_repo = $this->getDoctrine()
					->getRepository('AppBundle:FrameCompany');

				foreach($data as $incoming) {
					if ($incoming->clientmodified) {

						if (!$dbresult = $companies_repo->findById($incoming->id)) {
							$company = new FrameCompany();
						} else {
							$company = $dbresult[0];
						}

						$company->setTitle($incoming->name);
						$company->setDescription($incoming->description);
						$company->setOwner($user->getId());
						$company->setHexcolor($incoming->color);
						$company->setFrames($incoming->frames);
						$company->setIsShared($incoming->shared);
						$company->setDateModified(new \DateTime());

						try {
							$em = $this->getDoctrine()->getManager();
							$em->persist($company);
							$em->flush();

							$result[] = array(
								'id' => $company->getId(),
								'name' => $company->getTitle(),
								'servermodified' => $company->getDateModified(),
							);
						} catch (Exception $e) {
							$success_check = false;
						}
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

				// if type = ...

				$companies_repo = $this->getDoctrine()
					->getRepository('AppBundle:FrameCompany');

				$companies = $companies_repo->findByOwner($user->getId());

				$output = array();

				$response = array(
					'type' => 'company',
				);
				foreach ($companies as $company) {
					$c = array();
					$c['id'] = $company->getId();
					$c['name'] = $company->getTitle();
					$c['description'] = $company->getDescription();
					$c['owner'] = $user->getUsername();
					$c['color'] = $company->getHexcolor();
					$c['frames'] = $company->getFrames();
					$c['shared'] = $company->getIsShared();
					$c['created'] = $company->getDateCreated();
					$c['servermodified'] = $company->getDateModified();
					$response['data'][] = $c;
				}
				$output[] = $response;

				return new JsonResponse($output);

		} else {
			return new Response('Auth Failure', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
		}
	}

	/**
	 * @Route("/delete-data", name="delete-data")
	 */
	public function deleteDataAction() {
		$success_check = true;

		$auth_checker = $this->get('security.authorization_checker');

		if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
			$user = $this->get('security.token_storage')->getToken()->getUser();

			$result = [];
			if ($_REQUEST['company']) {
				$del_id = json_decode($_REQUEST['company']);

				$companies_repo = $this->getDoctrine()
					->getRepository('AppBundle:FrameCompany');

				if ($dbresult = $companies_repo->findById($del_id)) {
					$company = $dbresult[0];

					if ($company->getOwner() == $user->getUsername()) {
						try {
							$em = $this->getDoctrine()->getManager();

							$em->remove($company);
							$em->flush();

							$result[] = array(
								'id' => $company->getId(),
								'name' => $company->getTitle(),
								'servermodified' => $company->getDateModified(),
							);
						} catch (Exception $e) {
							$success_check = false;
						}
					} else {
						$success_check = false;
					}
				}

			}

			if ($success_check) {
				return new Response('', Response::HTTP_OK); // 200
			} else {
				return new Response('', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
			}
		} else {
			return new Response('Auth Failure', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
		}
	}




}
