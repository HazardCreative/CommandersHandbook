<?php

use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use function Symfony\Component\DependencyInjection\Loader\Configurator\ref;

return function (ContainerConfigurator $container) {
    $container->extension('msgphp_user', array (
  'class_mapping' => 
  array (
    'MsgPhp\\User\\Entity\\Role' => 'App\\Entity\\User\\Role',
    'MsgPhp\\User\\Entity\\UserRole' => 'App\\Entity\\User\\UserRole',
  ),
));

    $container->services()
        ->defaults()
            ->private()
            ->autoconfigure()
            ->autowire()

        ->set(App\Security\UserRolesProvider::class)
        ->alias(MsgPhp\User\Infra\Security\UserRolesProviderInterface::class, App\Security\UserRolesProvider::class)

        // non-FQCN service for decorating
        ->set('app.console.class_context_element_factory', App\Console\ClassContextElementFactory::class)
            ->decorate(MsgPhp\Domain\Infra\Console\Context\ClassContextElementFactoryInterface::class)
            ->arg('$factory', ref('app.console.class_context_element_factory.inner'))
    ;
};
