<?php
namespace App\Service;

use App\Entity\Post;
use App\Entity\Reply;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ReplyService extends AbstractController
{
    public function createReply(string $content, Request $request, EntityManagerInterface $entityManager, Post $post): Reply
    {
        // Retrieve the token from the Authorization header
        $authHeader = $request->headers->get('Authorization');
        if ($authHeader) {
            // Assuming token format: "Bearer <token>"
            $token = str_replace('Bearer ', '', $authHeader);
            // Decode token to retrieve the user ID; implement your token decoding logic here.
            $onlineRepo = $entityManager->getRepository(\App\Entity\Online::class);
            $online = $onlineRepo->findOneBy(['token' => $token]);
            if (!$online) {
                throw new \Exception('Invalid token');
            }
            $user =  $entityManager->getReference(\App\Entity\User::class, $online->getIdUser()->getId());
        } else {
            throw new \Exception('Veuillez être connecté');
        }

        // Create and populate the Reply entity
        $reply = new Reply();
        $reply->setPost($post);
        $reply->setMessage($content);
        $reply->setCreatedAt(new \DateTime());
        // Assuming that the user entity has a getUsername() method
        $reply->setAuthor($user->getUsername());
        

        $entityManager->persist($reply);
        $entityManager->flush();

        return $reply;
    }
}
