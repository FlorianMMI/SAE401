<?php

namespace App\Controller;

use App\Repository\PostRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Dto\Payload\CreateUserPayload;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;

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

    
} 