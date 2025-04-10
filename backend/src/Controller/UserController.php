<?php

namespace App\Controller;

use App\Repository\PostRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Dto\Payload\CreateUserPayload;
use App\Entity\User;
use App\Service\UserService;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
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
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'avatar' => $user->getAvatar(),
            'localisation' => $user->getLocalisation(),
            'siteweb' => $user->getSiteweb(),
            'bio' => $user->getBio(),
            'banniere' => $user->getBanniere(),
            
        ];
        
        return new JsonResponse($result, Response::HTTP_OK);
    }


    #[Route('/userpatch', name: 'user_update', methods: ['POST'])]
    public function patch(#[CurrentUser()] ?User $Cuser, Request $request, EntityManagerInterface $entityManager){
        

        $id = $Cuser->getId();
        
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $username = $request->request->get('username');
        $bio = $request->request->get('bio');
        $siteweb = $request->request->get('siteweb');
        $localisation = $request->request->get('localisation');

        if (null !== $username) {
            $user->setUsername($username);
        }
        if (null !== $bio) {
            $user->setBio($bio);
        }
        if (null !== $siteweb) {
            $user->setSiteweb($siteweb);
        }
        if (null !== $localisation) {
            $user->setLocalisation($localisation);
        }

        
        
        $uploadedavatar = $request->files->get('avatar');
        $uploadedbanniere = $request->files->get('banniere');


        

        $destinationA = $this->getParameter('kernel.project_dir') . '/public/avatar';
        $destinationB = $this->getParameter('kernel.project_dir') . '/public/banniere';
        
        try {
            if ($uploadedavatar !== null) {
            $filename = $uploadedavatar->getClientOriginalName();
            //Retourne le nom du fichier 
            $uploadedavatar->move($destinationA, $filename);
            $user->setAvatar($filename);
            }

            if ($uploadedbanniere !== null) {
            $filename2 = $uploadedbanniere->getClientOriginalName();
            //Retourne le nom du fichier
            $uploadedbanniere->move($destinationB, $filename2);
            $user->setBanniere($filename2);
            }
        } catch (FileException $e) {
            dump($e);
            return new JsonResponse(['message' => 'Erreur lors de l\'upload'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        // if (null !== $filename) {
        //     $user->setAvatar($filename);
        // }

        // if (null !== $filename2) {
        //     $user->setBanniere($filename2);
        // }

        $entityManager->persist($user);
        $entityManager->flush();
        
        return new JsonResponse(['message' => 'User updated'], Response::HTTP_OK);
        

       
    }


    #[Route('/user/subscribes', name: 'user_sub', methods: ['POST'])]
    public function subscribes_create(Request $request, EntityManagerInterface $entityManager): Response {
        $data = json_decode($request->getContent(), true);
        $user = $entityManager->getRepository(User::class)->find($data['id']);
        
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        
        $targetUser = $entityManager->getRepository(User::class)->find($data['sub']);
        
        if (!$targetUser) {
            return new JsonResponse(['message' => 'Target user not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Assuming User entity has methods to manage followers
        $user->addFollower($targetUser);
        
        $entityManager->persist($user);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Subscription created'], Response::HTTP_CREATED);
    }
    
    #[Route('/user/unsubscribes', name: 'user_unsub', methods: ['POST'])]
    public function unsubscribes_remove(Request $request, EntityManagerInterface $entityManager): Response {
        $data = json_decode($request->getContent(), true);
        $user = $entityManager->getRepository(User::class)->find($data['id']);
        
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        
        $targetUser = $entityManager->getRepository(User::class)->find($data['sub']);
        
        if (!$targetUser) {
            return new JsonResponse(['message' => 'Target user not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Assuming User entity has methods to manage followers
        $user->removeFollower($targetUser);
        
        $entityManager->persist($user);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Subscription removed'], Response::HTTP_OK);
    }

    #[Route('/api/getrole', name: 'getrole', methods: ['get'], format: 'json')]
    public function isAdmin(?User $currentuser): ?JsonResponse
    {
        if (!$currentuser) {
            return $this->json(['error' => 'Unauthorized 1'], Response::HTTP_FORBIDDEN);
        }
        if (!in_array('ROLE_ADMIN', $currentuser->getRoles())) {
            return $this->json(['error' => 'Unauthorized 2'], Response::HTTP_FORBIDDEN);
        }
        return null;
    }
    
    #[Route('/user/{id}/is-following', name: 'check_is_following', methods: ['GET'])]
    public function checkIsFollowing(#[CurrentUser()] ?User $currentUser, int $id, EntityManagerInterface $entityManager): Response
    {
        // Check if current user exists (is logged in)
        if (!$currentUser) {
            return new JsonResponse(['message' => 'Not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        // Find the target user
        $targetUser = $entityManager->getRepository(User::class)->find($id);

        if (!$targetUser) {
            return new JsonResponse(['message' => 'Target user not found'], Response::HTTP_NOT_FOUND);
        }

        // Directly query the user_user table
        $connection = $entityManager->getConnection();
        $sql = '
            SELECT COUNT(1) as is_following
            FROM user_user
            WHERE user_source = :currentUserId AND user_target = :targetUserId
        ';
        $result = $connection->executeQuery($sql, [
            'currentUserId' => $currentUser->getId(),
            'targetUserId' => $id
        ]);

        $isFollowing = (bool) $result->fetchOne();

        return new JsonResponse(['isFollowing' => $isFollowing], Response::HTTP_OK);
    }

   
    
}