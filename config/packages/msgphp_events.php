<?php

use App\EventSubscriber;
use MsgPhp\User\Event as UserEvent;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return function (ContainerConfigurator $container) {
	$container->services()
		->defaults()
			->autowire()
			->public()
		->set(EventSubscriber\UserCreated::class)
			->tag('event_subscriber', ['subscribes_to' => UserEvent\UserCreatedEvent::class])

		/*
		->set(EventSubscriber\ClearPasswordResetToken::class)
			->tag('event_subscriber', ['subscribes_to' => UserEvent\UserCredentialChangedEvent::class])
		->set(EventSubscriber\EnableConfirmedUser::class)
			->tag('event_subscriber', ['subscribes_to' => UserEvent\UserConfirmedEvent::class])
		->set(EventSubscriber\SendEmailConfirmationUrl::class)
			->tag('event_subscriber', ['subscribes_to' => UserEvent\UserEmailAddedEvent::class])
		->set(EventSubscriber\SendPasswordResetUrl::class)
			->tag('event_subscriber', ['subscribes_to' => UserEvent\UserPasswordRequestedEvent::class])
		->set(EventSubscriber\SendRegistrationConfirmationUrl::class)
			->tag('event_subscriber', ['subscribes_to' => UserEvent\UserCreatedEvent::class])
		*/
	;
};