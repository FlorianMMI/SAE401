<?php

namespace App\Controller;

use App\Entity\Post;
use App\Repository\PostRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class PostController extends AbstractController
{
    #[Route('/posts', name: 'post_list', methods: ['GET'])]
    public function index(PostRepository $postRepository, Request $request): Response
    {
        $page = $request->query->get('page', 1);
        $limit = 2;
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
    
}
