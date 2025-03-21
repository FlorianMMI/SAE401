<?php
namespace App\Service;

use App\Dto\Payload\CreatePostPayload;
use App\Entity\Post;
use App\Repository\PostRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PostService extends AbstractController
{
    public function create($content, EntityManagerInterface $entityManager): Post {
        $message = new Post();
        $message->setMessage($content);
        $message->setCreatedAt(new \DateTime());
        $message->setUser($this->getUser());
        $entityManager->persist($message);
        $entityManager->flush();
        return $message;
    }
}

?>