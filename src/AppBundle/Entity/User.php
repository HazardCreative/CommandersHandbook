<?php
// src/AppBundle/Entity/User.php

namespace AppBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     */
	protected $profile_realname;

    /**
     * @ORM\Column(type="boolean")
     */
	protected $profile_display_email;

    /**
     * @ORM\Column(type="decimal")
     */
	protected $geo_latitude;

    /**
     * @ORM\Column(type="decimal")
     */
	protected $geo_longitude;

    /**
     * @ORM\Column(type="datetime")
     */
	protected $elite_expires;

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
}
