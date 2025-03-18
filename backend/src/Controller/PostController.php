<?php

namespace App\Controller;

use App\Entity\Post;
use App\Repository\PostRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class PostController extends AbstractController
{
    #[Route('/posts', name: 'post_list', methods: ['GET'])]
    public function index(PostRepository $postRepository): Response
    {
        $posts = $postRepository->findAll();
        return $this->json(['posts' => $posts]);
    }
    
}
