<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;

class SecurityController extends AbstractController
{
        
    
    #[Route('/api/login', name: 'login_api', methods: ['POST'], format: 'json')]
    public function login(
        #[CurrentUser()] User $user, EntityManagerInterface $entityManager
    ): Response {
        $userService = new UserService();
        $online = $userService->create_token(['id' => $user->getId()], $entityManager);

        return $this->json([
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'avatar' => $user->getAvatar(),
            ],
            'token' => $online->getToken(),
        ]);
        // dd($user);
    }
}

?>