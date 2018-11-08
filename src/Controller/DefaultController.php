<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Form\EditProfileType;
use App\Form\EditLocationType;
use App\Entity\FrameCompany;
use App\Entity\RAGame;
use App\Entity\Location;
use App\Entity\User\User;

class DefaultController extends Controller {
	/**
	 * @Route("/", name="homepage")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function indexAction(User $user = null) {
		$auth_checker = $this->get('security.authorization_checker');

		if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
			if ($user->getUsername()) {
				return $this->render('mfzch/mfzch.html.twig');
			} else {
				$locations_repo = $this->getDoctrine()
					->getRepository('App:Location');

				$locations = $locations_repo->findByOwner($user->getId());

				$form = $this->createForm(EditProfileType::class, $user, array(
					'action' => $this->generateUrl('edit-profile')
				));

				$under_max_locations = (count($locations) < 3);

				return $this->render('mfzch/pages/command-home-new.html.twig',
					array(
						'locations' => $locations,
						'under_max_locations' => $under_max_locations,
						'form' => $form->createView()
					)
				);
			}
		} else {
			return $this->render('mfzch/mfzch.html.twig');
		}
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
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function commandNetworkAction(User $user) {
		$locations_repo = $this->getDoctrine()
			->getRepository('App:Location');

		$locations = $locations_repo->findByOwner($user->getId());

		$form = $this->createForm(EditProfileType::class, $user, array(
			'action' => $this->generateUrl('edit-profile')
		));

		$under_max_locations = (count($locations) < 3);

		return $this->render('mfzch/pages/command-home.html.twig',
			array(
				'locations' => $locations,
				'under_max_locations' => $under_max_locations,
				'form' => $form->createView()
			)
		);
	}

	/**
	 * @Route("/view-profile/{username}", name="view-profile-public")
	 */
	public function viewPublicProfileAction($username) {
		$users_repo = $this->getDoctrine()
			->getRepository('App:User\User');

		$user = $users_repo->findOneByUsername($username);

		$locations_repo = $this->getDoctrine()
			->getRepository('App:Location');

		$locations = $locations_repo->findByOwner($user->getId());

		$companies_repo = $this->getDoctrine()
			->getRepository('App:FrameCompany');

		$companies = $companies_repo->findBy([
			'owner' => $user->getId(),
			'is_shared' => true,
			'is_user_company' => false
		], ['title' => 'ASC']);

		return $this->render('view-public-profile.html.twig',
			array(
				'user' => $user,
				'locations' => $locations,
				'companies' => $companies
			)
		);
	}

	/**
	 * @Route("/edit-profile", name="edit-profile")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function editProfileAction(Request $request, User $user) {
		$form = $this->createForm(EditProfileType::class, $user);

		$form->handleRequest($request);

		if ($form->isSubmitted() && $form->isValid()) {
			$user = $form->getData();

			$em = $this->getDoctrine()->getManager();
			$em->persist($user);
			$em->flush();

			return $this->redirectToRoute('command-home');
		}

		return $this->render('edit-profile.html.twig', array(
			'form' => $form->createView()
		));
	}

	/**
	 * @Route("/edit-location/{loc_id}", name="edit-location")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function editLocationAction($loc_id, Request $request, User $user) {
		$locations_repo = $this->getDoctrine()
			->getRepository('App:Location');

		if ($loc_id == 'new') {
			$location = new Location();
			$location->setOwner($user->getId());
		} else {
			$location = $locations_repo->findOneById($loc_id);

			if ($location->getOwner() != $user->getId()) {
				$location = new Location();
				$location->setOwner($user->getId());
			}
		}

		$form = $this->createForm(EditLocationType::class, $location);

		$form->handleRequest($request);

		if ($form->isSubmitted() && $form->isValid()) {
			$loc = $form->getData();

			// *** check if max locations reached

			if ($loc->getOwner() == $user->getId()) {
				$em = $this->getDoctrine()->getManager();
				$em->persist($loc);
				$em->flush();
			}

			return $this->redirectToRoute('command-home');
		}

		return $this->render('edit-location.html.twig', array(
			'location' => $location,
			'form' => $form->createView()
		));
	}

	/**
	 * @Route("/remove-location/{loc_id}", name="remove-location")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function removeLocationAction($loc_id, Request $request, User $user) {
		$locations_repo = $this->getDoctrine()
			->getRepository('App:Location');

		$location = $locations_repo->findOneById($loc_id);

		if ($location->getOwner() == $user->getId()) {
			$em = $this->getDoctrine()->getManager();
			$em->remove($location);
			$em->flush();
		}

		return $this->redirectToRoute('command-home');
	}

	/**
	 * @Route("/player-finder", name="player-finder")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function playerFinderAction(Request $request, User $user) {
		$locations_repo = $this->getDoctrine()
			->getRepository('App:Location');

		$locations = $locations_repo->findByOwner($user->getId());

		return $this->render('player-finder.html.twig',
			array(
				'locations' => $locations
			)
		);
	}

/*
$users_repo = $this->getDoctrine()
	->getRepository('App:User\User');

$user = $users_repo->findOneByUsername($username);
*/

	/**
	 * @Route("/get-players", name="get-players")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function getPlayersAction(Request $request, User $user) {

		if ($_REQUEST['data']) {
			$data = json_decode($_REQUEST['data']);

			// Get closest

			$locations_repo = $this->getDoctrine()
				->getRepository('App:Location');

			$locations = $locations_repo->findByOwner($user->getId());

			$query = $this->getDoctrine()->getEntityManager()
				->createQuery(
					'SELECT l
					FROM App:Location l
					WHERE l.geo_latitude > :latmin
					AND l.geo_latitude < :latmax
					AND l.geo_longitude > :longmin
					AND l.geo_longitude < :longmax'
				)->setParameter('latmin', $data->_southWest->lat)
				->setParameter('latmax', $data->_northEast->lat +1)
				->setParameter('longmin', $data->_southWest->lng -1)
				->setParameter('longmax', $data->_northEast->lng +1);

			$queryResult = $query->getResult();

			$locOutput = [];
			foreach ($queryResult as $location) {
				$userObj = $this->getDoctrine()->getRepository('App:User\User')->find($location->getOwner());

				if ($userObj->getProfileIsPublic() ) {
					$loc['geo_latitude'] = $location->getGeoLatitude();
					$loc['geo_longitude'] = $location->getGeoLongitude();
					$loc['radius'] = $location->getRadius();

					$loc['name'] = $location->getName();
					$loc['description'] = $location->getDescription();

					$loc['username'] = $userObj->getUsername();
					$loc['link'] = $this->generateUrl('view-profile-public', array('username' => $userObj->getUsername()));

					if ($userObj->getId() == $user->getId()) {
						$loc['color'] = '#eeeeee';
					} else {
						$loc['color'] = '#be1e2d';
					}

					$locOutput[] = $loc;
				}
			}

			return new JsonResponse($locOutput);

		} else {
			return new Response('', Response::HTTP_INTERNAL_SERVER_ERROR); // 500
		}
	}

	/**
	 * @Route("/manage-conflicts", name="manage-conflicts")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function manageConflictsAction(Request $request, User $user) {
		$games_repo = $this->getDoctrine()
			->getRepository('App:RAGame');

		$games = $games_repo->findByOwner($user->getId());

		return $this->render('manage-conflicts.html.twig', array(
			'games' => $games
		));
	}

	/**
	 * @Route("/manage-companies", name="manage-companies")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function manageCompaniesAction(Request $request, User $user) {
		$companies_repo = $this->getDoctrine()
			->getRepository('App:FrameCompany');

		$companies = $companies_repo->findBy([
			'owner' => $user->getId(),
			'is_user_company' => false
		]);

		return $this->render('manage-companies.html.twig', array(
			'companies' => $companies
		));
	}

	/**
	 * @Route("/save-data", name="save-data")
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function saveDataAction(User $user = null) {
		$success_check = true;

		$auth_checker = $this->get('security.authorization_checker');

		if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
			if (new \DateTime("now") < $user->getEliteExpires()) {

				$result = [];
				if (isset($_REQUEST['companies']) && $_REQUEST['companies']) {
					$data = json_decode($_REQUEST['companies']);

					$companies_repo = $this->getDoctrine()
						->getRepository('App:FrameCompany');

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
						->getRepository('App:RAGame');

					if (!$dbresult = $game_repo->findByOwner($user->getId())) {
						$game = new RAGame;
						$game->setOwner($user->getId());
					} else {
						$game = $dbresult[0];
					}

					if ($incoming->clientmodified) {
						$date_now = new \DateTime();

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
						if (!$incoming->passwordSet) {
							$game->setViewPassword($incoming->viewPassword);
							$game->setModifyPassword($incoming->modifyPassword);
							$game->setPasswordSet($date_now);
						}
						$game->setDateModified($date_now);

						try {
							$em = $this->getDoctrine()->getManager();
							$em->persist($game);
							$em->flush();

							$result[] = array(
								'dbid' => $game->getId(),
								'servermodified' => $game->getDateModified(),
								'passwordSet' => $game->getPasswordSet()
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
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function loadDataAction(User $user = null) {
		$auth_checker = $this->get('security.authorization_checker');

		if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
			if (new \DateTime("now") < $user->getEliteExpires()) {
				$output = array();

				if (isset($_REQUEST['type'])) {
					if ($_REQUEST['type'] == 'companies') {
						$companies_repo = $this->getDoctrine()
							->getRepository('App:FrameCompany');

						$companies = $companies_repo->findBy([
							'owner' => $user->getId(),
							'is_user_company' => false
						]);

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
							->getRepository('App:RAGame');

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
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function deleteDataAction(User $user = null) {
		$success_check = true;

		$auth_checker = $this->get('security.authorization_checker');

		if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
			if (new \DateTime("now") < $user->getEliteExpires()) {
				$result = [];
				if ($_REQUEST['companies']) {
					$del_id = json_decode($_REQUEST['companies']);

					$companies_repo = $this->getDoctrine()
						->getRepository('App:FrameCompany');

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
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function patchGameAction(User $user = null) {
		$success_check = true;

		$result = [];
		if ($_REQUEST['patch']) {
			$game_dbid = json_decode($_REQUEST['game_dbid']);
			$data = json_decode($_REQUEST['patch']);

			$game_repo = $this->getDoctrine()
				->getRepository('App:RAGame');

			$game = $game_repo->findOneById($game_dbid);

			if ($game) {
				// patch security
				$grant = false;

				// patching allowed by game owner
				$auth_checker = $this->get('security.authorization_checker');
				if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
					if ($game->getOwner() == $user->getId()) {
						$grant = true;
					}
				}

				// patching allowed by anyone with modify password
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
						return new Response('Database Error', Response::HTTP_INTERNAL_SERVER_ERROR);
					}

					$result[] = array(
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
	 * @ParamConverter("user", converter="msgphp.current_user")
	 */
	public function loadRemoteGameAction(User $user = null) {
		if (isset($_REQUEST['type'])
			&& $_REQUEST['type'] == 'game') {

			$remote = json_decode($_REQUEST['data']);

			$game_repo = $this->getDoctrine()->getRepository('App:RAGame');

			$game = $game_repo->findOneByUuid( $remote->id );

			if (isset($game)) {
				$grant = false;

				// always give owner rights
				$auth_checker = $this->get('security.authorization_checker');
				if ($auth_checker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
					if ($game->getOwner() == $user->getId()) {
						$grant = 'modify';
					}
				}

				if (!$grant) {
					if (!$game->getModifyPassword()
						&& !$game->getViewPassword()) {

						$grant = 'modify';

					} elseif ($game->getModifyPassword()
						&& !$game->getViewPassword()
						&& !$remote->password) {

						$grant = 'view-nopass';

					} elseif ($remote->password) {

						if ($game->getModifyPassword() == $remote->password) {

							$grant = 'modify';

						} elseif ($game->getViewPassword()
							&& $game->getViewPassword() == $remote->password) {

							$grant = 'view';

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
					$response['data']['passwordSet'] = $game->getPasswordSet();
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
