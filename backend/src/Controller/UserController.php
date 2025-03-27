<?php

namespace App\Controller;

use App\Repository\PostRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Dto\Payload\CreateUserPayload;
use App\Entity\User;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
        
    
    #[Route('/users', name: 'user_create', methods: ['POST'], format: 'json')]
    public function create(Request $request, UserService $UserService, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher): Response{

        $data = json_decode($request->getContent(), true);
        
        if (empty($data['username'])) {
            throw new \Exception('Message is required');
        }

        $payload = new CreateUserPayload($data['password']);
        $data['password'] = $payload->getPassword();
        $post = $UserService->create($data, $entityManager, $userPasswordHasher);
        
        return new JsonResponse(['message' => 'Post created'], Response::HTTP_CREATED);
    }

    #[Route('/user/{id}', name: 'user_get', methods: ['GET'])]
    public function fetchUser(#[CurrentUser()] ?User $user, int $id, EntityManagerInterface $entityManager  ): Response
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        
        $result = [
            'username' => $user->getUsername(),
            'avatar' => $user->getAvatar(),
            'localisation' => $user->getLocalisation(),
            'siteweb' => $user->getSiteweb(),
            'bio' => $user->getBio(),
            'banniere' => $user->getBanniere(),
            
        ];
        
        return new JsonResponse($result, Response::HTTP_OK);
    }
    
} 