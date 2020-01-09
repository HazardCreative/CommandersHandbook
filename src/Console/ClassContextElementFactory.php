<?php

declare(strict_types=1);

namespace App\Console;

use App\Entity\User\User;
use MsgPhp\Domain\Infra\Console\Context\ClassContextElementFactoryInterface;
use MsgPhp\Domain\Infra\Console\Context\ContextElement;
use MsgPhp\User\Entity\Credential\EmailPassword;
use MsgPhp\User\Password\PasswordHashingInterface;

final class ClassContextElementFactory implements ClassContextElementFactoryInterface
{
    private $factory;
    private $passwordHashing;

    public function __construct(ClassContextElementFactoryInterface $factory, PasswordHashingInterface $passwordHashing)
    {
        $this->factory = $factory;
        $this->passwordHashing = $passwordHashing;
    }

    public function getElement(string $class, string $method, string $argument): ContextElement
    {
        $element = $this->factory->getElement($class, $method, $argument);

        switch ($argument) {
            case 'email':
                $element->label = 'E-mail';
                break;
            case 'password':
                if (User::class === $class || EmailPassword::class === $class) {
                    $element
                        ->hide()
                        ->generator(function (): string {
                            return bin2hex(random_bytes(8));
                        })
                        ->normalizer(function (string $value): string {
                            return $this->passwordHashing->hash($value);
                        });
                }
                break;
        }

        return $element;
    }
}
