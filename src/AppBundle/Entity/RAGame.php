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
	const STATUS_OPEN = 0;
	const STATUS_IN_PROGRESS = 1;
	const STATUS_FINISHED = 2;

	const SETUP_OPEN = 0; // players can see company data before lock-in
	const SETUP_BLIND = 1; // players enter own data only

	const VIEW_PRIVATE = 0; // no access
	const VIEW_RESTRICTED = 1; // password required
	const VIEW_OPEN = 2; // publicly listed

	const CONTROL_SELF = 0;
	const CONTROL_CONNECTED = 1; // current players may update
	const CONTROL_ALL = 2; // not recommended with VIEW_OPEN

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
	protected $id;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
	protected $description;

    /**
     * @ORM\Column(type="integer")
     */
	protected $owner;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
	protected $json_data;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
	protected $log;

    /**
     * @ORM\Column(type="smallint")
     */
	protected $status = self::STATUS_OPEN;

    /**
     * @ORM\Column(type="smallint")
     */
	protected $setup_type = self::SETUP_OPEN;

    /**
     * @ORM\Column(type="smallint")
     */
	protected $access_view = self::VIEW_PRIVATE;

    /**
     * @ORM\Column(type="smallint")
     */
	protected $access_control = self::CONTROL_SELF;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
	protected $access_players;

	/**
     * @ORM\Column(type="string", nullable=true)
     */
	protected $password;

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
		$this->date_created = $current;
		$this->date_modified = $current;
	}

	/*
	game/blorf/372
	*/

    public function __construct() {
    }
}