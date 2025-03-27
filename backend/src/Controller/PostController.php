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
        $limit = 6;
        $offset = $limit * ($page - 1);
        


        $posts = iterator_to_array($postRepository->paginateAllOrderedByLatest($offset, $limit));
        $paginator = ['posts' => array_map(function($post) {
            return [
            'id' => $post->getId(),                
            'message' => $post->getMessage(),
            'created_at' => $post->getCreatedAt() ? $post->getCreatedAt()->format('Y-m-d H-i-s') : null,
            'likes' => $post->getLikes() ? $post->getLikes()->getLikes() : 0,
            'user' => $post->getUser() ? [
                'id' => $post->getUser()->getId(),
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

    #[Route('/post/{userid}', name: 'post_list_id', methods: ['GET'])]
    public function postbyuser(PostRepository $postRepository, Request $request): Response
    {
        $page = $request->query->get('page', 1);
        $limit = 6;
        $offset = $limit * ($page - 1);
        


        $userId = $request->attributes->get('userid');
        $posts = $postRepository->findBy(
            ['user_id' => $userId],
            ['created_at' => 'DESC'],
            $limit,
            $offset
        );
        $paginator = ['posts' => array_map(function($post) {
            return [
            'id' => $post->getId(),                
            'message' => $post->getMessage(),
            'created_at' => $post->getCreatedAt() ? $post->getCreatedAt()->format('Y-m-d H-i-s') : null,
            'likes' => $post->getLikes() ? $post->getLikes()->getLikes() : 0,
            'user' => $post->getUser() ? [
                'id' => $post->getUser()->getId(),
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

    #[Route('/post/{id}', name: 'post_delete', methods: ['DELETE'], format: 'json')]
    public function delete(int $id, PostRepository $postRepository, EntityManagerInterface $entityManager): Response
    {
        $post = $postRepository->find($id);

        if (!$post) {
            return new JsonResponse(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($post);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Post deleted'], Response::HTTP_OK);
    }
}