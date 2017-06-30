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
use AppBundle\Entity\RAGame;

class DefaultController extends Controller {
	/**
	 * @Route("/", name="homepage")
	 */
	public function indexAction() {
		return $this->render('mfzch/mfzch.html.twig');
	}

	/**
	 * @Route("/game/{gameid}/", name="remote-game")
	 */
	public function remoteGameAction($gameid) {
		return $this->render('mfzch/mfzch.html.twig',
			array(
				'remotegame' => true,
				'gameid' => $gameid
			)
		);
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
			if (new \DateTime("now") < $user->getEliteExpires()) {

				$result = [];
				if (isset($_REQUEST['companies']) && $_REQUEST['companies']) {
					$data = json_decode($_REQUEST['companies']);

					$companies_repo = $this->getDoctrine()
						->getRepository('AppBundle:FrameCompany');

					foreach($data as $incoming) {
						if (!$dbresult = $companies_repo->findById($incoming->dbid)) {
							$company = new FrameCompany();
							$company->setOwner($user->getId());
						} else {
							$company = $dbresult[0];
						}

						// *** check read/modify permissions
						if ($incoming->clientmodified) {
							$company->setTitle($incoming->name);
							$company->setDescription($incoming->description);
							$company->setHexcolor($incoming->color);
							$company->setFrames($incoming->frames);
							$company->setIsShared($incoming->shared);
							$company->setDateModified(new \DateTime());

							try {
								$em = $this->getDoctrine()->getManager();
								$em->persist($company);
								$em->flush();

								$result[] = array(
									'dbid' => $company->getId(),
									'name' => $company->getTitle(),
									'servermodified' => $company->getDateModified(),
								);
							} catch (Exception $e) {
								$success_check = false;
								break;
							}
						} else {
							$result[] = array(
								'dbid' => $company->getId(),
								'name' => $company->getTitle(),
								'servermodified' => $company->getDateModified(),
							);
						}
					}
				} else if (isset($_REQUEST['game']) && $_REQUEST['game']) {
					$incoming = json_decode($_REQUEST['game']);

					$game_repo = $this->getDoctrine()
						->getRepository('AppBundle:RAGame');

					if (!$dbresult = $game_repo->findByOwner($user->getId())) {
						$game = new RAGame;
						$game->setOwner($user->getId());
					} else {
						$game = $dbresult[0];
					}

					if ($incoming->clientmodified) {
						$game->setDescription($incoming->description);
						$game->setUuid($incoming->uuid);
						$game->setDoomsday($incoming->doomsday);
						$game->setRound($incoming->round);
						$game->setGameType($incoming->gameType);
						$game->setLog($incoming->log);
						$game->setMaxFrames($incoming->maxFrames);
						$game->setMinFrames($incoming->minFrames);
						$game->setStationsPerPlayer($incoming->stationsPerPlayer);
						$game->setUnclaimedStations($incoming->unclaimedStations);
						$game->setTeams($incoming->teams);
						$game->setTrackingLevel($incoming->trackingLevel);
						$game->setStartTime($incoming->startTime);
						$game->setIntendedPlayers($incoming->intendedPlayers);
						$game->setBlindSetup($incoming->blindSetup);
						$game->setShared($incoming->shared);
						$game->setStatus($incoming->status);
						$game->setViewPassword($incoming->viewPassword);
						$game->setModifyPassword($incoming->modifyPassword);
						$game->setDateModified(new \DateTime());

						try {
							$em = $this->getDoctrine()->getManager();
							$em->persist($game);
							$em->flush();

							$result[] = array(
								'dbid' => $game->getId(),
								'servermodified' => $game->getDateModified(),
							);
						} catch (Exception $e) {
							$success_check = false;
						}
					} else {
						$result[] = array(
							'dbid' => $game->getId(),
							'servermodified' => $game->getDateModified(),
						);
					}
				}

				if ($success_check) {
					return new JsonResponse($result);
				} else {
					return new Response('Data Error', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
				}
			} else {
				return new Response('Non-elite', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
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

			if (new \DateTime("now") < $user->getEliteExpires()) {
				$output = array();

				if (isset($_REQUEST['type'])) {
					if ($_REQUEST['type'] == 'companies') {
						$companies_repo = $this->getDoctrine()
							->getRepository('AppBundle:FrameCompany');

						$companies = $companies_repo->findByOwner($user->getId());

						$response = array(
							'type' => 'companies',
						);
						foreach ($companies as $company) {
							$c = array();
							$c['dbid'] = $company->getId();
							$c['name'] = $company->getTitle();
							$c['description'] = $company->getDescription();
							$c['owner'] = $user->getUsername(); // db query forces this to be true
							$c['color'] = $company->getHexcolor();
							$c['frames'] = $company->getFrames();
							$c['shared'] = $company->getIsShared();
							$c['created'] = $company->getDateCreated();
							$c['servermodified'] = $company->getDateModified();
							$response['data'][] = $c;
						}

						$output[] = $response;
					} else if ($_REQUEST['type'] == 'game') {
						$game_repo = $this->getDoctrine()
							->getRepository('AppBundle:RAGame');

						$games = $game_repo->findByOwner($user->getId());
						$game = $games[0];

						$response = array(
							'type' => 'game',
						);

						$g = array();
						$g['dbid'] = $game->getId();
						$g['uuid'] = $game->getUUID();
						$g['description'] = $game->getDescription();
						$g['owner'] = $user->getUsername(); // db query forces this to be true
						$g['doomsday'] = $game->getDoomsday();
						$g['round'] = $game->getRound();
						$g['gameType'] = $game->getGameType();
						$g['log'] = $game->getLog();
						$g['maxFrames'] = $game->getMaxFrames();
						$g['minFrames'] = $game->getMinFrames();
						$g['stationsPerPlayer'] = $game->getStationsPerPlayer();
						$g['unclaimedStations'] = $game->getUnclaimedStations();
						$g['teams'] = $game->getTeams();
						$g['trackingLevel'] = $game->getTrackingLevel();
						$g['startTime'] = $game->getStartTime();
						$g['intendedPlayers'] = $game->getIntendedPlayers();
						$g['blindSetup'] = $game->getBlindSetup();
						$g['shared'] = $game->getShared();
						$g['status'] = $game->getStatus();
						$g['viewPassword'] = $game->getViewPassword();
						$g['modifyPassword'] = $game->getModifyPassword();
						$g['created'] = $game->getDateCreated();
						$g['servermodified'] = $game->getDateModified();
						$response['data'][] = $g;

						$output[] = $response;
					}

					return new JsonResponse($output);
				} else {
					return new Response('Data Error', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
				}
			} else {
				return new Response('Non-elite', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
			}
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

			if (new \DateTime("now") < $user->getEliteExpires()) {
				$result = [];
				if ($_REQUEST['companies']) {
					$del_id = json_decode($_REQUEST['companies']);

					$companies_repo = $this->getDoctrine()
						->getRepository('AppBundle:FrameCompany');

					if ($dbresult = $companies_repo->findById($del_id)) {
						$company = $dbresult[0];

						if ($company->getOwner() == $user->getId()) {
							try {
								$em = $this->getDoctrine()->getManager();

								$em->remove($company);
								$em->flush();

								$result[] = array(
									'dbid' => $company->getId(),
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
					return new Response('Data Error', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
				}
			} else {
				return new Response('Non-elite', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
			}
		} else {
			return new Response('Auth Failure', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
		}
	}

	/**
	 * @Route("/patch-game", name="patch-game")
	 */
	public function patchGameAction() {
		$success_check = true;

		$result = [];
		if ($_REQUEST['patch']) {
			$game_dbid = json_decode($_REQUEST['game_dbid']);
			$data = json_decode($_REQUEST['patch']);

			$game_repo = $this->getDoctrine()
				->getRepository('AppBundle:RAGame');

			$game = $game_repo->findOneById($game_dbid);

			if ($game) {
				// patch allowed by owner or anyone with password
				$grant = false;

				$auth_checker = $this->get('security.authorization_checker');
				if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
					$user = $this->get('security.token_storage')->getToken()->getUser();
					if ($game->getOwner() == $user->getId()) {
						$grant = true;
					}
				}

				if (!$grant
					&& isset($_REQUEST['password'])
					&& $game->getModifyPassword() == $_REQUEST['password']) {
					$grant = true;
				}

				if ($grant) {
					foreach($data as $patch) {
						$game->applyPatch($patch);
					}

					$game->setDateModified(new \DateTime());

					try {
						$em = $this->getDoctrine()->getManager();
						$em->persist($game);
						$em->flush();
					} catch (Exception $e) {
						$success_check = false;
					}

					$result[] = array( // *** revisit if each is needed
						'dbid' => $game->getId(),
						'uuid' => $game->getUUID(),
						'doomsday' => $game->getDoomsday(),
						'round' => $game->getRound(),
						'gameType' => $game->getGameType(),
						'log' => $game->getLog(),
						'maxFrames' => $game->getMaxFrames(),
						'minFrames' => $game->getMinFrames(),
						'stationsPerPlayer' => $game->getStationsPerPlayer(),
						'unclaimedStations' => $game->getUnclaimedStations(),
						'teams' => $game->getTeams(),
						'trackingLevel' => $game->getTrackingLevel(),
						'startTime' => $game->getStartTime(),
						'intendedPlayers' => $game->getIntendedPlayers(),
						'blindSetup' => $game->getBlindSetup(),
						'shared' => $game->getShared(),
						'status' => $game->getStatus(),
						// 'viewPassword' => $game->getViewPassword(),
						// 'modifyPassword' => $game->getModifyPassword(),
						'created' => $game->getDateCreated(),
						'servermodified' => $game->getDateModified(),
					);

					return new JsonResponse($result);
				} else {
					return new Response('Auth Failure', Response::HTTP_INTERNAL_SERVER_ERROR);
				}
			} else {
				return new Response('No Game', Response::HTTP_INTERNAL_SERVER_ERROR);
			}
		} else {
			return new Response('No Patch', Response::HTTP_INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @Route("/remote-load-game/", name="remote-load-game")
	 */
	public function loadRemoteGameAction() {
		if (isset($_REQUEST['type'])
			&& $_REQUEST['type'] == 'game') {

			$remote = json_decode($_REQUEST['data']);

			$game_repo = $this->getDoctrine()->getRepository('AppBundle:RAGame');

			$game = $game_repo->findOneByUuid( $remote->id );

			if (isset($game)) {
				if ($game->getModifyPassword() == $remote->password) {
					$grant = 'modify';
				} elseif ($game->getViewPassword() == $remote->password) {
					$grant = 'view';
				} else {
					$grant = false;
				}

				if (!$grant) {
					$auth_checker = $this->get('security.authorization_checker');
					if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
						$user = $this->get('security.token_storage')->getToken()->getUser();
						if ($game->getOwner() == $user->getId()) {
							$grant = true;
						}
					}
				}

				if ($grant) {
					$response = array();

					$response['type'] = 'game';

					$response['data']['dbid'] = $game->getId();
					$response['data']['uuid'] = $game->getUuid();
					$response['data']['description'] = $game->getDescription();
					$response['data']['doomsday'] = $game->getDoomsday();
					$response['data']['round'] = $game->getRound();
					$response['data']['gameType'] = $game->getGameType();
					$response['data']['log'] = $game->getLog();
					$response['data']['maxFrames'] = $game->getMaxFrames();
					$response['data']['minFrames'] = $game->getMinFrames();
					$response['data']['stationsPerPlayer'] = $game->getStationsPerPlayer();
					$response['data']['unclaimedStations'] = $game->getUnclaimedStations();
					$response['data']['teams'] = $game->getTeams();
					$response['data']['trackingLevel'] = $game->getTrackingLevel();
					$response['data']['startTime'] = $game->getStartTime();
					$response['data']['intendedPlayers'] = $game->getIntendedPlayers();
					$response['data']['blindSetup'] = $game->getBlindSetup();
					$response['data']['shared'] = $game->getShared();
					$response['data']['status'] = $game->getStatus();
					$response['data']['created'] = $game->getDateCreated();
					$response['data']['servermodified'] = $game->getDateModified();

					$response['grant'] = $grant;

					return new JsonResponse($response);
				} else {
					return new Response('Auth Failure', Response::HTTP_OK); // 500
				}
			} else {
				return new Response('No Game', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
			}
		} else {
			return new Response('Bad Request', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
		}
	}
}
