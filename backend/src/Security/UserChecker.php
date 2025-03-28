<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if (!$user instanceof User) {
            return;
        }
        if ($user->isBlocked()) {
            // Lève une exception qui sera remontée lors de l'authentification
            throw new CustomUserMessageAccountStatusException('Votre compte a été bloqué.');
        }
    }

    public function checkPostAuth(UserInterface $user): void
    {
        // Rien à vérifier ici dans cet exemple
    }
}