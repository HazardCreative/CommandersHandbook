<?php
// src/AppBundle/Entity/RAGame.php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="gamedata")
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
     * @ORM\Column(type="string")
     */
	protected $owner;

    /**
     * @ORM\Column(type="string")
     */
	protected $json_data;

    /**
     * @ORM\Column(type="string")
     */
	protected $log;

    /**
     * @ORM\Column(type="string")
     */
	protected $status = STATUS_OPEN;

    /**
     * @ORM\Column(type="string")
     */
	protected $setup_type = SETUP_OPEN;

    /**
     * @ORM\Column(type="string")
     */
	protected $access_view = VIEW_PRIVATE;

    /**
     * @ORM\Column(type="string")
     */
	protected $access_control = CONTROL_SELF;

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
	protected $date_created = date('Y-m-d h:i:s');

    /**
     * @ORM\Column(type="datetime")
     */
	protected $date_modified = date('Y-m-d h:i:s');

	/*
	game/blorf/372
	*/

    public function __construct() {
    }
}
