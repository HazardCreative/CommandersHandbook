<?php

declare(strict_types=1);

namespace App\Security;

use App\Entity\User\User;
use App\Entity\User\UserRole;
use MsgPhp\User\Entity\User as BaseUser;
use MsgPhp\User\Infra\Security\UserRolesProviderInterface;

final class UserRolesProvider implements UserRolesProviderInterface
{
    /**
     * @param User $user
     */
    public function getRoles(BaseUser $user): array
    {
        return array_merge(['ROLE_USER'], $user->getRoles()->map(function (UserRole $userRole) {
            return $userRole->getRoleName();
        }));
    }
}
