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

    #[Route('/api/getrole', name: 'get_user', methods: ['GET'], format: 'json')]
    public function getRole(
        #[CurrentUser()] User $user
    ): Response {
        return $this->json([
            'user' => [
                'id' => $user->getId(),
                'roles' => $user->getRoles(),
            ],
        ]);
    }

    #[Route('/user', name: 'user', methods: ['GET'], format: 'json')]
    public function listUsers(
        #[CurrentUser()] ?User $user,
        EntityManagerInterface $entityManager
    ): Response {
        if (!$user || !in_array('admin', $user->getRoles(), true)) {
            dump($user);
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        $users = $entityManager->getRepository(User::class)->findAll();

        $data = array_map(function (User $user) {
            return [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ];
        }, $users);

        return $this->json(['users' => $data]);
    }
}

?>