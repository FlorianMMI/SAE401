<?php
namespace App\Service;

use App\Dto\Payload\CreatePostPayload;
use App\Entity\Post;
use App\Repository\PostRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class PostService extends AbstractController
{
    
    public function create($content, Request $request, EntityManagerInterface $entityManager, $filename): Post {
        
            $authHeader = $request->headers->get('Authorization');
            if ($authHeader) {
            // Assuming token format: "Bearer <token>"
            $token = str_replace('Bearer ', '', $authHeader);
            // Decode token to retrieve the user ID. Implement your token decoding logic here.
            $onlineRepo = $entityManager->getRepository(\App\Entity\Online::class);
            $online = $onlineRepo->findOneBy(['token' => $token]);
            if (!$online) {
                throw new \Exception('Invalid token');
            }
            $userId = $online->getIdUser()->getId();
            $user =  $entityManager->getReference(\App\Entity\User::class, $userId);
            } else {
            throw new \Exception('Veuillez être connecter');
            }
        $message = new Post();
        $message->setMessage($content);
        $message->setCreatedAt(new \DateTime());
        $message->setUser($user);
        $message->setisCensored(false);
        // Check if a media filename is provided and set it
       
        if ($filename !== null) {
            $message->setMedia($filename);
        }
        $entityManager->persist($message);
        $entityManager->flush();

        // Insert an entry in the like table with 0 likes for the newly created post
        $like = new \App\Entity\Like();
        $like->setPost($message);
        $like->setLikes(0);
        $entityManager->persist($like);
        $entityManager->flush();

        return $message;
    }
    
    
}

?>