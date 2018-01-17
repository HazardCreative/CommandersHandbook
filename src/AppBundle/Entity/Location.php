<?php
// src/AppBundle/Entity/Location.php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="locations")
 * @ORM\HasLifecycleCallbacks
 */
class Location {
	/**
	 * @ORM\Id
	 * @ORM\Column(type="integer")
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	protected $id;

	/**
	 * @ORM\Column(type="integer")
	 */
	protected $owner;

	/**
	 * @ORM\Column(type="string", nullable=true)
	 */
	public $name = 'New Location';

	/**
	 * @ORM\Column(type="text", nullable=true)
	 */
	public $description;

	/**
	 * @ORM\Column(type="decimal", precision=8, scale=5, nullable=true)
	 */
	public $geo_latitude;

	/**
	 * @ORM\Column(type="decimal", precision=8, scale=5, nullable=true)
	 */
	public $geo_longitude;

	/**
	 * @ORM\Column(type="integer", nullable=true)
	 */
	public $radius = '10';

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
     * Set owner
     *
     * @param integer $owner
     *
     * @return Location
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
     * Set name
     *
     * @param string $name
     *
     * @return Location
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Location
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
     * Set geoLatitude
     *
     * @param string $geoLatitude
     *
     * @return Location
     */
    public function setGeoLatitude($geoLatitude)
    {
        $this->geo_latitude = $geoLatitude;

        return $this;
    }

    /**
     * Get geoLatitude
     *
     * @return string
     */
    public function getGeoLatitude()
    {
        return $this->geo_latitude;
    }

    /**
     * Set geoLongitude
     *
     * @param string $geoLongitude
     *
     * @return Location
     */
    public function setGeoLongitude($geoLongitude)
    {
        $this->geo_longitude = $geoLongitude;

        return $this;
    }

    /**
     * Get geoLongitude
     *
     * @return string
     */
    public function getGeoLongitude()
    {
        return $this->geo_longitude;
    }

    /**
     * Set radius
     *
     * @param integer $radius
     *
     * @return Location
     */
    public function setRadius($radius)
    {
        $this->radius = $radius;

        return $this;
    }

    /**
     * Get radius
     *
     * @return integer
     */
    public function getRadius()
    {
        return $this->radius;
    }

    /**
     * Set dateCreated
     *
     * @param \DateTime $dateCreated
     *
     * @return Location
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
     * @return Location
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
}
