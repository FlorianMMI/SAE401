<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Doctrine\ORM\EntityManagerInterface;

class BlockController extends AbstractController
{
    #[Route('/blocked', name: 'blocked_index', methods: ['GET'], format: 'json')]
    public function index(#[CurrentUser()] User $cuser, UserRepository $userRepository): Response
    {
       //check if the user is connected 
         if (!$cuser) {
                return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
          }
    
          // Fetch the blocked users
        $blockedUsers = $cuser->getBlockedUsers();
            $blockedUsers = $blockedUsers->toArray();
    
          // Normalize the blocked users
          $normalizedBlockedUsers = array_map(function(User $user) {
                return [
                 'id' => $user->getId(),
                 'username' => $user->getUsername(),
                ];
          }, $blockedUsers);
    
          return $this->json($normalizedBlockedUsers, Response::HTTP_OK);
    }
    


      #[Route('/block/{id}', name: 'block_user', methods: ['POST'], format: 'json')]
    public function create(#[CurrentUser()] User $cuser, UserRepository $userRepository, int $id, EntityManagerInterface $entityManager): Response
    {
        // check if the user is connected 
        if (!$cuser) {
          return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }
    
        // Fetch the user to be blocked
        $userToBlock = $userRepository->find($id);
    
        if (!$userToBlock) {
          return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
    
        // If the current user is following the user to block, unfollow them
        if ($cuser->getFollower()->contains($userToBlock)) {
          $cuser->removeFollower($userToBlock);
        }
    
        // Block the user
        $cuser->addBlockedUser($userToBlock);
        $entityManager->flush();
    
        return $this->json(['message' => 'User blocked successfully'], Response::HTTP_OK);
    }

      #[Route('/unblock/{id}', name: 'unblock_user', methods: ['POST'], format: 'json')]
      public function delete(#[CurrentUser()] User $cuser, UserRepository $userRepository, int $id, EntityManagerInterface $entityManager): Response
      {
          //check if the user is connected 
          if (!$cuser) {
                return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
          }
    
          // Fetch the user to be unblocked
          $userToUnblock = $userRepository->find($id);
    
          if (!$userToUnblock) {
              return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
          }
    
          // Unblock the user
          $cuser->removeBlockedUser($userToUnblock);
          $entityManager->flush();
    
          return $this->json(['message' => 'User unblocked successfully'], Response::HTTP_OK);
      }
}