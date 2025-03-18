<?php

namespace App\Controller;

use App\Entity\Post;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class PostController extends AbstractController
{
    /**
     * Récupération de plusieurs ressources.
     * GET /posts
     *
     * Note : seule la méthode GET est acceptée.
     * 
     * @Route("/posts", name="post_index", methods={"GET"})
     */
    public function index(): Response
    {
        
    }

    // ... les autres méthodes restent inchangées ...
}
