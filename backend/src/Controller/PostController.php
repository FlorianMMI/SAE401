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

class PostController extends AbstractController
{
    #[Route('/post', name: 'post_list', methods: ['GET'])]
    public function index(PostRepository $postRepository, Request $request): Response
    {
        $page = $request->query->get('page', 1);
        $limit = 4;
        $offset = $limit * ($page - 1);
        


        $posts = iterator_to_array($postRepository->paginateAllOrderedByLatest($offset, $limit));
        $paginator = ['posts' => array_map(function($post) {
            return [
            'id' => $post->getId(),                
            'message' => $post->getMessage(),
            'created_at' => $post->getCreatedAt() ? $post->getCreatedAt()->format('Y-m-d H-i-s') : null,
            'user' => $post->getUser() ? [
                'username' => $post->getUser()->getUsername(),
                'image' => $post->getUser()->getAvatar(),
            ] : null,
            ];
        }, $posts)];

        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = count($posts) === $limit ? $page + 1 : null;
        
        return $this->json([
            'posts' => $paginator,
            'previous_page' => $previousPage,
            'next_page' => $nextPage
        ]);
        
    }
    #[Route('/posts', name: 'post_create', methods: ['POST'], format: 'json')]
    public function create(Request $request, PostService $postService, EntityManagerInterface $entityManager): Response{

        $data = json_decode($request->getContent(), true);

        if (empty($data['message'])) {
            throw new \Exception('Message is required');
        }

        $payload = new CreatePostPayload($data['message']);
        $post = $postService->create($payload->getContent() ,$request, $entityManager);
        
        return new JsonResponse(['message' => 'Post created'], Response::HTTP_CREATED);
    }
}