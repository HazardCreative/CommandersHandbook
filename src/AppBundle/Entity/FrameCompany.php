<?php
// src/AppBundle/Entity/FrameCompany.php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="framecompany")
 * @ORM\HasLifecycleCallbacks
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
	protected $description;

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

}
