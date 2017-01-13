<?php
// src/AppBundle/Entity/FrameCompany.php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="framecompany")
 */
class FrameCompany {
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
	protected $id;

    /**
     * @ORM\Column(type="string")
     */
	protected $title;

    /**
     * @ORM\Column(type="string")
     */
	protected $owner;

    /**
     * @ORM\Column(type="string")
     */
	protected $json_data;

    /**
     * @ORM\Column(type="boolean")
     */
	protected $is_shared = false;

    /**
     * @ORM\Column(type="datetime")
     */
	protected $date_created = date('Y-m-d h:i:s');

    /**
     * @ORM\Column(type="datetime")
     */
	protected $date_modified = date('Y-m-d h:i:s');

}
