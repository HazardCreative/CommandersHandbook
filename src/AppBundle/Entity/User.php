<?php
// src/AppBundle/Entity/User.php

namespace AppBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 */
class User extends BaseUser {
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
	public $profile_realname;

    /**
     * @ORM\Column(type="boolean")
     */
	public $profile_is_public = false;

    /**
     * @ORM\Column(type="boolean")
     */
	public $profile_display_email = false;

    /**
     * @ORM\Column(type="decimal", precision=8, scale=5, nullable=true)
     */
	public $geo_latitude;

    /**
     * @ORM\Column(type="decimal", precision=8, scale=5, nullable=true)
     */
	public $geo_longitude;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
	public $elite_expires;

    /**
     * @ORM\Column(type="integer", nullable=true, unique=true)
     */
	public $patreon_id;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
	public $patreon_tokens;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
	public $patreon_pledges;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
	public $patreon_data;

    public function __construct()
    {
        parent::__construct();
        // your own logic
    }

    /**
     * Set profileDisplayEmail
     *
     * @param boolean $profileDisplayEmail
     *
     * @return User
     */
    public function setProfileDisplayEmail($profileDisplayEmail)
    {
        $this->profile_display_email = $profileDisplayEmail;

        return $this;
    }

    /**
     * Get profileDisplayEmail
     *
     * @return boolean
     */
    public function getProfileDisplayEmail()
    {
        return $this->profile_display_email;
    }

    /**
     * Set profileRealname
     *
     * @param string $profileRealname
     *
     * @return User
     */
    public function setProfileRealname($profileRealname)
    {
        $this->profile_realname = $profileRealname;

        return $this;
    }

    /**
     * Get profileRealname
     *
     * @return string
     */
    public function getProfileRealname()
    {
        return $this->profile_realname;
    }

    /**
     * Set geoLatitude
     *
     * @param string $geoLatitude
     *
     * @return User
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
     * @return User
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
     * Set eliteExpires
     *
     * @param \DateTime $eliteExpires
     *
     * @return User
     */
    public function setEliteExpires($eliteExpires)
    {
        $this->elite_expires = $eliteExpires;

        return $this;
    }

    /**
     * Get eliteExpires
     *
     * @return \DateTime
     */
    public function getEliteExpires()
    {
        return $this->elite_expires;
    }

    /**
     * Set profileIsPublic
     *
     * @param boolean $profileIsPublic
     *
     * @return User
     */
    public function setProfileIsPublic($profileIsPublic)
    {
        $this->profile_is_public = $profileIsPublic;

        return $this;
    }

    /**
     * Get profileIsPublic
     *
     * @return boolean
     */
    public function getProfileIsPublic()
    {
        return $this->profile_is_public;
    }

    /**
     * Set patreonId
     *
     * @param integer $patreonId
     *
     * @return User
     */
    public function setPatreonId($patreonId)
    {
        $this->patreon_id = $patreonId;

        return $this;
    }

    /**
     * Get patreonId
     *
     * @return integer
     */
    public function getPatreonId()
    {
        return $this->patreon_id;
    }

    /**
     * Set patreonTokens
     *
     * @param integer $patreonTokens
     *
     * @return User
     */
    public function setPatreonTokens($patreonTokens)
    {
        $this->patreon_tokens = $patreonTokens;

        return $this;
    }

    /**
     * Get patreonTokens
     *
     * @return integer
     */
    public function getPatreonTokens()
    {
        return $this->patreon_tokens;
    }

    /**
     * Set patreonPledges
     *
     * @param integer $patreonPledges
     *
     * @return User
     */
    public function setPatreonPledges($patreonPledges)
    {
        $this->patreon_pledges = $patreonPledges;

        return $this;
    }

    /**
     * Get patreonPledges
     *
     * @return integer
     */
    public function getPatreonPledges()
    {
        return $this->patreon_pledges;
    }

    /**
     * Set patreonData
     *
     * @param array $patreonData
     *
     * @return User
     */
    public function setPatreonData($patreonData)
    {
        $this->patreon_data = $patreonData;

        return $this;
    }

    /**
     * Get patreonData
     *
     * @return array
     */
    public function getPatreonData()
    {
        return $this->patreon_data;
    }

}
