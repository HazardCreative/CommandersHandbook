<?php

namespace App\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use MsgPhp\User\Entity\User as BaseUser;
use MsgPhp\User\UserIdInterface;
use MsgPhp\Domain\Event\DomainEventHandlerInterface;
use MsgPhp\Domain\Event\DomainEventHandlerTrait;
use MsgPhp\User\Entity\Credential\EmailPassword;
use MsgPhp\User\Entity\Features\EmailPasswordCredential;
use MsgPhp\User\Entity\Features\ResettablePassword;
use MsgPhp\User\Entity\Fields\RolesField;

/**
 * @ORM\Entity()
 */
class User extends BaseUser implements DomainEventHandlerInterface
{
    use DomainEventHandlerTrait;
    use EmailPasswordCredential;
    use ResettablePassword;
    use RolesField;

    /** @ORM\Id() @ORM\GeneratedValue() @ORM\Column(type="msgphp_user_id") */
    private $id;

    /**
     * @ORM\Column(type="string", nullable=true, unique=true)
     */
    public $username;

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
     * @ORM\Column(type="string", nullable=true)
     */
    public $profile_color;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    public $profile_icon;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    public $profile_game_preferences;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    public $profile_materials;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    public $profile_experience;

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

    public function __construct(UserIdInterface $id, string $email, string $password)
    {
        $this->id = $id;
        $this->credential = new EmailPassword($email, $password);
    }

    public function getId(): UserIdInterface
    {
        return $this->id;
    }

    /**
     * Set username
     *
     * @param string $username
     *
     * @return User
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
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
     * Set profileColor
     *
     * @param string $profile_color
     *
     * @return User
     */
    public function setProfileColor($profileColor)
    {
        $this->profile_color = $profileColor;

        return $this;
    }

    /**
     * Get profileColor
     *
     * @return string
     */
    public function getProfileColor()
    {
        return $this->profile_color;
    }

    /**
     * Set profileIcon
     *
     * @param string $profile_icon
     *
     * @return User
     */
    public function setProfileIcon($profileIcon)
    {
        $this->profile_icon = $profileIcon;

        return $this;
    }

    /**
     * Get profileIcon
     *
     * @return string
     */
    public function getProfileIcon()
    {
        return $this->profile_icon;
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

    /**
     * Update Elite Status
     *
     */
    public function updateEliteStatus()
    {
        $pledge = $this->patreon_pledges;

        if ($pledge['attributes']['last_charge_status'] == "Paid"
            && $pledge['attributes']['currently_entitled_amount_cents']) {

            $old_expires = $this->getEliteExpires();
            $new_expires = date_create($pledge['attributes']['last_charge_date'])->modify('15th day of next month 00:00:00');
            $expires = max($old_expires, $new_expires);
            $this->setEliteExpires($expires);
        }
    }

    /**
     * Check if Elite status needs refreshed
     *
     * @return boolean
     */
    public function eliteStatusNeedsRefreshed()
    {
        if ($this.getPatreonId() &&
            new \DateTime("now") > $user->getEliteExpires()->modify('1st day of month 00:00:00')) {
            return true;
        }

        return false;
    }
}
