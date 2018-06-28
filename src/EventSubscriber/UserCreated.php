<?php
// src/EventSubscriber/UserCreated.php

namespace App\EventSubscriber;

use App\Entity\User\User;
use Msgphp\User\Event\UserCreatedEvent;
use MsgPhp\User\Infra\Security\SecurityUserProvider;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

class UserCreated {
	private $provider;
	private $request;

	public function __construct(
		SecurityUserProvider $securityUserProvider,
		Request $request
	) {
	    $this->provider = $securityUserProvider;
	    $this->request = $request;
	}

	public function __invoke(
				UserCreatedEvent $event
			) {

			die('event fired');

			$securityUser = $this->provider->fromUser($event->user);

			$token = new UsernamePasswordToken($securityUser, $securityUser->getPassword(), "public", $securityUser->getRoles());

			$loginEvent = new InteractiveLoginEvent($this->request, $token);
			$this->get("event_dispatcher")->dispatch("security.interactive_login", $loginEvent);
	}
}
