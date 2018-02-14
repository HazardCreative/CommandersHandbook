<?php
// src/AppBundle/Entity/RAGame.php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="gamedata")
 * @ORM\HasLifecycleCallbacks
 */
class RAGame {
	const STATUS_PARAMETERS = 0;
	const STATUS_ENTER_TEAMS = 1;
	const STATUS_RESOLVE_TIES = 2;
	const STATUS_DEPLOYMENT = 3;
	const STATUS_IN_PROGRESS = 4;
	const STATUS_ENDED = 5;

	/**
	 * @ORM\Id
	 * @ORM\Column(type="integer")
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	protected $id;

	/**
	 * @ORM\Column(type="string")
	 */
	protected $uuid;

	/**
	 * @ORM\Column(type="string", nullable=true)
	 */
	protected $description;

	/**
	 * @ORM\Column(type="integer")
	 */
	protected $owner;

	/**
	 * @ORM\Column(type="smallint")
	 */
	protected $doomsday = 0;

	/**
	 * @ORM\Column(type="smallint")
	 */
	protected $round = 0;

	/**
	 * @ORM\Column(type="string")
	 */
	protected $gameType = 'Battle';

	/**
	 * @ORM\Column(type="string", nullable=true)
	 */
	protected $log = '';

	/**
	 * @ORM\Column(type="smallint")
	 */
	protected $maxFrames = 7;

	/**
	 * @ORM\Column(type="smallint")
	 */
	protected $minFrames = 4;

	/**
	 * @ORM\Column(type="smallint")
	 */
	protected $stationsPerPlayer = 2;

	/**
	 * @ORM\Column(type="smallint")
	 */
	protected $unclaimedStations = 0;

	/**
	 * @ORM\Column(type="array", nullable=true)
	 */
	protected $teams = array();

	/**
	 * @ORM\Column(type="smallint")
	 */
	protected $trackingLevel = 10;

	/**
	 * @ORM\Column(type="string", nullable=true)
	 */
	protected $startTime = '';

	/**
	 * @ORM\Column(type="smallint")
	 */
	protected $intendedPlayers = 3;

	/**
	 * @ORM\Column(type="boolean")
	 */
	protected $blindSetup = false;

	/**
	 * @ORM\Column(type="boolean")
	 */
	protected $shared = false;

	/**
	 * @ORM\Column(type="smallint")
	 */
	protected $status = self::STATUS_PARAMETERS;

	/**
	 * @ORM\Column(type="datetime")
	 */
	protected $password_set;

	/**
	 * @ORM\Column(type="string", nullable=true)
	 */
	protected $view_password;

	/**
	 * @ORM\Column(type="string", nullable=true)
	 */
	protected $modify_password;

	/**
	 * @ORM\Column(type="datetime")
	 */
	protected $date_created;
	// change to ... options={"default": 0}

	/**
	 * @ORM\Column(type="datetime")
	 */
	protected $date_modified;
	// change to ... options={"default": 0}

	/**
	 * @ORM\PrePersist
	 */
	public function onPrePersistSetDefaultDates() {
		$current = new \DateTime();
		$this->password_set = $current;
		$this->date_created = $current;
		$this->date_modified = $current;
	}

	/*
	game/blorf/372
	*/

	public function __construct() {
	}

	public function applyPatch($patch) {
		switch ($patch->action) {
			case 'doomsday':
				$this->doomsday = $patch->doomsday;
				break;

			case 'round':
				$this->round = $patch->round;
				break;

			case 'unclaimedStations':
				$this->unclaimedStations = $patch->unclaimedStations;
				break;

			case 'log':
				$this->log .= $patch->log;
				break;

			case 'status':
				$this->status = $patch->status;
				break;

			case 'team-gStations':
				if (count($this->teams)) {
					foreach($this->teams as $teamkey => $teamval) {
						if ($teamval->uuid == $patch->teamid) {
							$this->teams[$teamkey]->gStations = $patch->gStations;

							if (isset($patch->gScore)) {
								$this->teams[$teamkey]->gScore = $patch->gScore;
							}
						}
					}
					$this->teams[0] = clone $this->teams[0]; // Doctrine won't presist this otherwise
				}
				break;

			case 'team-add':
				$this->teams[] = $patch->team;
				break;

			case 'team-del':
				if (count($this->teams)) {
					foreach($this->teams as $teamkey => $teamval) {
						if ($teamval->uuid == $patch->teamid) {
							unset($this->teams[$teamkey]);
							$this->teams = array_values($this->teams);
						}
					}
				}
				break;

			case 'team-name':
				if (count($this->teams)) {
					foreach($this->teams as $teamkey => $teamval) {
						if ($teamval->uuid == $patch->teamid) {
							$this->teams[$teamkey]->name = $patch->name;
						}
					}
					$this->teams[0] = clone $this->teams[0]; // Doctrine won't presist this otherwise
				}
				break;

			case 'team-color':
				if (count($this->teams)) {
					foreach($this->teams as $teamkey => $teamval) {
						if ($teamval->uuid == $patch->teamid) {
							$this->teams[$teamkey]->color = $patch->color;
						}
					}
					$this->teams[0] = clone $this->teams[0];
					break;
				}

			case 'team-gFrames':
				if (count($this->teams)) {
					foreach($this->teams as $teamkey => $teamval) {
						if ($teamval->uuid == $patch->teamid) {
							$this->teams[$teamkey]->gFrames = $patch->gFrames;

							if (isset($patch->gScore)) {
								$this->teams[$teamkey]->gScore = $patch->gScore;
							}
						}
					}
					$this->teams[0] = clone $this->teams[0];
					break;
				}

			case 'team-sSystems':
				if (count($this->teams)) {
					foreach($this->teams as $teamkey => $teamval) {
						if ($teamval->uuid == $patch->teamid) {
							$this->teams[$teamkey]->sSystems = $patch->sSystems;
						}
					}
					$this->teams[0] = clone $this->teams[0];
					break;
				}

			case 'team-frame-add':
				if (count($this->teams)) {
					foreach($this->teams as $teamkey => $teamval) {
						if ($teamval->uuid == $patch->teamid) {
							$this->teams[$teamkey]->cFrames[] = $patch->frame;
						}
					}
					$this->teams[0] = clone $this->teams[0];
					break;
				}

			case 'team-frame-del':
				if (count($this->teams)) {
					foreach($this->teams as $teamkey => $teamval) {
						if ($teamval->uuid == $patch->teamid) {
							if (count($teamval->cFrames)) {
								foreach($teamval->cFrames as $framekey => $frame) {
									if ($frame->uuid = $patch->frameid) {
										unset($this->teams[$teamkey]->cFrames[$framekey]);
									}
								}
							}
						}
					}
					$this->teams[0] = clone $this->teams[0];
					break;
				}

			case 'team-frame-update':
				if (count($this->teams)) {
					foreach($this->teams as $teamkey => $teamval) {
						if ($teamval->uuid == $patch->teamid) {
							if (count($teamval->cFrames)) {
								foreach($teamval->cFrames as $framekey => $frame) {
									if ($frame->uuid = $patch->frameid) {
										$this->teams[$teamkey]->cFrames[$framekey] = $patch->frame;
									}
								}
							}
						}
					}
					$this->teams[0] = clone $this->teams[0];
					break;
				}

			case 'team-frames-replace':
				if (count($this->teams)) {
					foreach($this->teams as $teamkey => $teamval) {
						if ($teamval->uuid == $patch->teamid) {
							$this->teams[$teamkey]->cFrames = $patch->cFrames;
						}
					}
					$this->teams[0] = clone $this->teams[0];
					break;
				}

		}

		return $this;
	}

	/**
	 * Get id
	 *
	 * @return integer
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * Set description
	 *
	 * @param string $description
	 *
	 * @return RAGame
	 */
	public function setDescription($description)
	{
		$this->description = $description;

		return $this;
	}

	/**
	 * Get description
	 *
	 * @return string
	 */
	public function getDescription()
	{
		return $this->description;
	}

	/**
	 * Set owner
	 *
	 * @param integer $owner
	 *
	 * @return RAGame
	 */
	public function setOwner($owner)
	{
		$this->owner = $owner;

		return $this;
	}

	/**
	 * Get owner
	 *
	 * @return integer
	 */
	public function getOwner()
	{
		return $this->owner;
	}

	/**
	 * Set doomsday
	 *
	 * @param integer $doomsday
	 *
	 * @return RAGame
	 */
	public function setDoomsday($doomsday)
	{
		$this->doomsday = $doomsday;

		return $this;
	}

	/**
	 * Get doomsday
	 *
	 * @return integer
	 */
	public function getDoomsday()
	{
		return $this->doomsday;
	}

	/**
	 * Set round
	 *
	 * @param integer $round
	 *
	 * @return RAGame
	 */
	public function setRound($round)
	{
		$this->round = $round;

		return $this;
	}

	/**
	 * Get round
	 *
	 * @return integer
	 */
	public function getRound()
	{
		return $this->round;
	}

	/**
	 * Set gameType
	 *
	 * @param string $gameType
	 *
	 * @return RAGame
	 */
	public function setGameType($gameType)
	{
		$this->gameType = $gameType;

		return $this;
	}

	/**
	 * Get gameType
	 *
	 * @return string
	 */
	public function getGameType()
	{
		return $this->gameType;
	}

	/**
	 * Set log
	 *
	 * @param string $log
	 *
	 * @return RAGame
	 */
	public function setLog($log)
	{
		$this->log = $log;

		return $this;
	}

	/**
	 * Get log
	 *
	 * @return string
	 */
	public function getLog()
	{
		return $this->log;
	}

	/**
	 * Set maxFrames
	 *
	 * @param integer $maxFrames
	 *
	 * @return RAGame
	 */
	public function setMaxFrames($maxFrames)
	{
		$this->maxFrames = $maxFrames;

		return $this;
	}

	/**
	 * Get maxFrames
	 *
	 * @return integer
	 */
	public function getMaxFrames()
	{
		return $this->maxFrames;
	}

	/**
	 * Set minFrames
	 *
	 * @param integer $minFrames
	 *
	 * @return RAGame
	 */
	public function setMinFrames($minFrames)
	{
		$this->minFrames = $minFrames;

		return $this;
	}

	/**
	 * Get minFrames
	 *
	 * @return integer
	 */
	public function getMinFrames()
	{
		return $this->minFrames;
	}

	/**
	 * Set stationsPerPlayer
	 *
	 * @param integer $stationsPerPlayer
	 *
	 * @return RAGame
	 */
	public function setStationsPerPlayer($stationsPerPlayer)
	{
		$this->stationsPerPlayer = $stationsPerPlayer;

		return $this;
	}

	/**
	 * Get stationsPerPlayer
	 *
	 * @return integer
	 */
	public function getStationsPerPlayer()
	{
		return $this->stationsPerPlayer;
	}

	/**
	 * Set unclaimedStations
	 *
	 * @param integer $unclaimedStations
	 *
	 * @return RAGame
	 */
	public function setUnclaimedStations($unclaimedStations)
	{
		$this->unclaimedStations = $unclaimedStations;

		return $this;
	}

	/**
	 * Get unclaimedStations
	 *
	 * @return integer
	 */
	public function getUnclaimedStations()
	{
		return $this->unclaimedStations;
	}

	/**
	 * Set teams
	 *
	 * @param array $teams
	 *
	 * @return RAGame
	 */
	public function setTeams($teams)
	{
		$this->teams = $teams;

		return $this;
	}

	/**
	 * Get teams
	 *
	 * @return array
	 */
	public function getTeams()
	{
		return $this->teams;
	}

	/**
	 * Set trackingLevel
	 *
	 * @param integer $trackingLevel
	 *
	 * @return RAGame
	 */
	public function setTrackingLevel($trackingLevel)
	{
		$this->trackingLevel = $trackingLevel;

		return $this;
	}

	/**
	 * Get trackingLevel
	 *
	 * @return integer
	 */
	public function getTrackingLevel()
	{
		return $this->trackingLevel;
	}

	/**
	 * Set startTime
	 *
	 * @param string $startTime
	 *
	 * @return RAGame
	 */
	public function setStartTime($startTime)
	{
		$this->startTime = $startTime;

		return $this;
	}

	/**
	 * Get startTime
	 *
	 * @return string
	 */
	public function getStartTime()
	{
		return $this->startTime;
	}

	/**
	 * Set intendedPlayers
	 *
	 * @param integer $intendedPlayers
	 *
	 * @return RAGame
	 */
	public function setIntendedPlayers($intendedPlayers)
	{
		$this->intendedPlayers = $intendedPlayers;

		return $this;
	}

	/**
	 * Get intendedPlayers
	 *
	 * @return integer
	 */
	public function getIntendedPlayers()
	{
		return $this->intendedPlayers;
	}

	/**
	 * Set blindSetup
	 *
	 * @param boolean $blindSetup
	 *
	 * @return RAGame
	 */
	public function setBlindSetup($blindSetup)
	{
		$this->blindSetup = $blindSetup;

		return $this;
	}

	/**
	 * Get blindSetup
	 *
	 * @return boolean
	 */
	public function getBlindSetup()
	{
		return $this->blindSetup;
	}

	/**
	 * Set shared
	 *
	 * @param string $shared
	 *
	 * @return RAGame
	 */
	public function setShared($shared)
	{
		$this->shared = $shared;

		return $this;
	}

	/**
	 * Get shared
	 *
	 * @return string
	 */
	public function getShared()
	{
		return $this->shared;
	}

	/**
	 * Set status
	 *
	 * @param integer $status
	 *
	 * @return RAGame
	 */
	public function setStatus($status)
	{
		$this->status = $status;

		return $this;
	}

	/**
	 * Get status
	 *
	 * @return integer
	 */
	public function getStatus()
	{
		return $this->status;
	}

	/**
	 * Get passwordSet
	 *
	 * @return integer
	 */
	public function getPasswordSet()
	{
		return $this->password_set;
	}

	/**
	 * Set passwordSet
	 *
	 * @return integer
	 */
	public function setPasswordSet($passwordSet)
	{
		$this->password_set = $passwordSet;

		return $this;
	}

	/**
	 * Set viewPassword
	 *
	 * @param integer $viewPassword
	 *
	 * @return RAGame
	 */
	public function setViewPassword($viewPassword)
	{
		$this->view_password = $viewPassword;
		$this->password_set = new \DateTime();;

		return $this;
	}

	/**
	 * Get viewPassword
	 *
	 * @return integer
	 */
	public function getViewPassword()
	{
		return $this->view_password;
	}

	/**
	 * Set modifyPassword
	 *
	 * @param integer $modifyPassword
	 *
	 * @return RAGame
	 */
	public function setModifyPassword($modifyPassword)
	{
		$this->modify_password = $modifyPassword;
		$this->password_set = new \DateTime();;

		return $this;
	}

	/**
	 * Get modifyPassword
	 *
	 * @return integer
	 */
	public function getModifyPassword()
	{
		return $this->modify_password;
	}

	/**
	 * Set dateCreated
	 *
	 * @param \DateTime $dateCreated
	 *
	 * @return RAGame
	 */
	public function setDateCreated($dateCreated)
	{
		$this->date_created = $dateCreated;

		return $this;
	}

	/**
	 * Get dateCreated
	 *
	 * @return \DateTime
	 */
	public function getDateCreated()
	{
		return $this->date_created;
	}

	/**
	 * Set dateModified
	 *
	 * @param \DateTime $dateModified
	 *
	 * @return RAGame
	 */
	public function setDateModified($dateModified)
	{
		$this->date_modified = $dateModified;

		return $this;
	}

	/**
	 * Get dateModified
	 *
	 * @return \DateTime
	 */
	public function getDateModified()
	{
		return $this->date_modified;
	}

	/**
	 * Set uUID
	 *
	 * @param string $uUID
	 *
	 * @return RAGame
	 */
	public function setUuid($uuid)
	{
		$this->uuid = $uuid;

		return $this;
	}

	/**
	 * Get uUID
	 *
	 * @return string
	 */
	public function getUuid()
	{
		return $this->uuid;
	}
}
