<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Online;
use phpDocumentor\Reflection\Types\Boolean;

class SecurityController extends AbstractController
{
        
    
    #[Route('/api/login', name: 'login_api', methods: ['POST'], format: 'json')]
    public function login(
        #[CurrentUser()] ?User $user, EntityManagerInterface $entityManager
    ): JsonResponse {
        $userService = new UserService();
        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }
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
        
    }

    #[Route('/api/getidmessage', name: 'get_user', methods: ['GET'], format: 'json')]
    public function getRole(Request $request, EntityManagerInterface $entityManager): Response {
        // Get the token from the Authorization header
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return $this->json(['error' => 'Token not provided'], Response::HTTP_FORBIDDEN);
        }
        // Remove the "Bearer " prefix if present
        if (strpos($token, 'Bearer ') === 0) {
            $token = substr($token, 7);
        }
        
        // Look for the token record in the database (assumes an Online entity exists)
        $online = $entityManager->getRepository(Online::class)->findOneBy(['token' => $token]);
        if (!$online) {
            return $this->json(['error' => 'Token not found'], Response::HTTP_FORBIDDEN);
        }

        $user = $online->getIdUser();
        if (!$user) {
            return $this->json(['error' => 'User not found for the token'], Response::HTTP_FORBIDDEN);
        }
        
        return $this->json([
            'user' => [
                'id' => $user->getId(),
            ],
        ]);
    }

    #[Route('/api/getrole', name: 'admin', methods: ['get'], format: 'json')]
    private function isAdmin(?User $currentuser): ?JsonResponse
    {
        if (!$currentuser) {
            return $this->json(['error' => 'Unauthorized 1'], Response::HTTP_FORBIDDEN);
        }
        if (!in_array('ROLE_ADMIN', $currentuser->getRoles())) {
            return $this->json(['error' => 'Unauthorized 2'], Response::HTTP_FORBIDDEN);
        }
        return null;
    }

    
    #[Route('/user', name: 'user', methods: ['GET'], format: 'json')]
    public function listUsers(
        #[CurrentUser()] ?User $user,
        EntityManagerInterface $entityManager
    ): Response {
        
        if ($response = $this->isAdmin($user)) {
            return $response;
        }
        //     return $this->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        // }

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