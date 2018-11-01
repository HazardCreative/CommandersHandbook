<?php
// src/App/Entity/FrameCompany.php

namespace App\Entity;

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
     * @ORM\Column(type="string", nullable=true)
     */
	protected $title;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
	protected $description;

    /**
     * @ORM\Column(type="msgphp_user_id")
     */
	protected $owner;

    /**
     * @ORM\Column(type="string")
     */
	protected $hexcolor;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
	protected $frames;

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
     * Set title
     *
     * @param string $title
     *
     * @return FrameCompany
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return FrameCompany
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
     * @param string $owner
     *
     * @return FrameCompany
     */
    public function setOwner($owner)
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * Get owner
     *
     * @return string
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * Set hexcolor
     *
     * @param string $hexcolor
     *
     * @return FrameCompany
     */
    public function setHexcolor($hexcolor)
    {
        $this->hexcolor = $hexcolor;

        return $this;
    }

    /**
     * Get hexcolor
     *
     * @return string
     */
    public function getHexcolor()
    {
        return $this->hexcolor;
    }

    /**
     * Set frames
     *
     * @param string $frames
     *
     * @return FrameCompany
     */
    public function setFrames($frames)
    {
        $this->frames = $frames;

        return $this;
    }

    /**
     * Get frames
     *
     * @return string
     */
    public function getFrames()
    {
        return $this->frames;
    }

    /**
     * Set isShared
     *
     * @param boolean $isShared
     *
     * @return FrameCompany
     */
    public function setIsShared($isShared)
    {
        $this->is_shared = $isShared;

        return $this;
    }

    /**
     * Get isShared
     *
     * @return boolean
     */
    public function getIsShared()
    {
        return $this->is_shared;
    }

    /**
     * Set isShared
     *
     * @param boolean $isShared
     *
     * @return FrameCompany
     */
    public function setIsShared($isShared)
    {
        $this->is_shared = $isShared;

        return $this;
    }

    /**
     * Get isShared
     *
     * @return boolean
     */
    public function getIsShared()
    {
        return $this->is_shared;
    }

    /**
     * Set dateCreated
     *
     * @param \DateTime $dateCreated
     *
     * @return FrameCompany
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
     * @return FrameCompany
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
