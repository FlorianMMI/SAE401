<?php

namespace App\Controller;

use App\Repository\PostRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Dto\Payload\CreatePostPayload;
use App\Service\PostService;
use Doctrine\ORM\EntityManagerInterface;
// Removed unused SerializerInterface import.
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class LikesController extends AbstractController
{
    #[Route('/like/{id}', name: 'likes_patch', methods: ['PATCH'])]
    public function like(Request $request, PostRepository $postRepository, int $id, EntityManagerInterface $entityManager): Response
    {
        $post = $postRepository->find($id);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Récupère la valeur de l'incrément depuis la requête (par exemple en JSON ou un paramètre)
        $data = json_decode($request->getContent(), true);
        $increment = isset($data['increment']) ? (int) $data['increment'] : 0;
        
        if ($increment === 0) {
            return $this->json(['error' => 'Increment non valide'], Response::HTTP_BAD_REQUEST);
        }

        $likesEntity = $post->getLikes();
        $likesEntity->setLikes($likesEntity->getLikes() + $increment);

        $entityManager->flush();

        return $this->json([
            'id' => $post->getId(),
            'likes' => $post->getLikes()->getLikes(),
        ]);
    }
}