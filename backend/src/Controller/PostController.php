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
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Entity\User;

class PostController extends AbstractController
{
    #[Route('/post', name: 'post_list', methods: ['GET'])]
    public function index(  PostRepository $postRepository, Request $request): Response
    {
        
        

        $page = $request->query->get('page', 1);
        $limit = 20;
        $offset = $limit * ($page - 1);
        


        $posts = iterator_to_array($postRepository->paginateAllOrderedByLatest($offset, $limit));
        $paginator = ['posts' => array_map(function($post)  {
            $blocked = $post->getUser() && $post->getUser()->isblocked();
            $censored = $post->isCensored();
            ;
            return [
                
                'id' => $post->getId(),     
                           
                'message' => $censored
                    ? "Le contenu à était censuré car il ne respectait pas les conditions d’utilisation"
                    : ($blocked
                        ? "Ce compte a été bloqué pour non respect des conditions d’utilisation"
                        : $post->getMessage()),
                'created_at' => $post->getCreatedAt()
                    ? $post->getCreatedAt()->format('Y-m-d H-i-s')
                    : null,
                'media' => $censored
                    ? null
                    : ($post->getMedia()
                        ? $post->getMedia()
                        : null),
                'likes' => $blocked ? null : ($post->getLikes() ? $post->getLikes()->getLikes() : 0),
                'user' => $post->getUser() ? [
                    'id' => $post->getUser()->getId(),
                    'username' => $blocked ? "Utilisateur Bloqué par ADMIN" : $post->getUser()->getUsername(),
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
        $limit = 20;
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
            'media' => $post->getMedia() ? $post->getMedia(): null,
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


    #[Route('/posting/following', name: 'post_following', methods: ['GET'])]
    public function followingPosts(PostRepository $postRepository, Request $request): Response
    {
        $user = $this->getUser();
        
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        
        $page = $request->query->get('page', 1);
        $limit = 20;
        $offset = $limit * ($page - 1);

        // Assumes PostRepository has a method to retrieve posts from users followed by the current user.
        $posts = $postRepository->findPostsFromFollowedUsers($user, $offset, $limit);

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
    public function create(Request $request, PostService $postService, EntityManagerInterface $entityManager): Response
    {
        // Check if request is multipart/form-data or JSON
        if (str_contains($request->headers->get('Content-Type'), 'multipart/form-data')) {
            $message = $request->request->get('message');
            $mediaFile = $request->files->get('media');
            
            if (empty($message)) {
                throw new \Exception('Message is required');
            }
            
            $filename = null;
            if ($mediaFile) {
                $originalFilename = pathinfo($mediaFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = transliterator_transliterate(
                    'Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()',
                    $originalFilename
                );
                $newFilename = $safeFilename.'-'.uniqid().'.'.$mediaFile->guessExtension();
                
                // Move file to public directory
                try {
                    $mediaFile->move(
                        $this->getParameter('kernel.project_dir').'/public/uploads',
                        $newFilename
                    );
                    $filename = $newFilename;
                } catch (\Exception $e) {
                    return new JsonResponse(['error' => 'Failed to upload file'], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }
           
            $post = $postService->create($message, $request, $entityManager, $filename);
            
            $entityManager->flush(); // Save the changes
        } else {
            $data = json_decode($request->getContent(), true);
            
            if (empty($data['message'])) {
                throw new \Exception('Message is required');
            }
            
            $payload = new CreatePostPayload($data['message']);
            $filename = null;
            $post = $postService->create($payload->getContent(), $request, $entityManager, $filename);
            
            $entityManager->flush(); // Save the changes
        }
        
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

    #[Route('/post/patch/{id}', name: 'post_update', methods: ['POST'], format: 'json')]
    public function patch(int $id, Request $request, PostRepository $postRepository, EntityManagerInterface $entityManager): Response
    {
        $post = $postRepository->find($id);

        if (!$post) {
            return new JsonResponse(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        $message = $request->request->get('message');
        if ($message) {
            $post->setMessage($message);
        }

        // Handle media
        $mediaAction = $request->request->get('media_action');
        
        if ($mediaAction === 'delete') {
            // Delete existing media file if it exists
            if ($post->getMedia()) {
            $filePath = $this->getParameter('kernel.project_dir') . '/public/uploads/' . $post->getMedia();
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            $post->setMedia(null);
            }
        } elseif ($mediaFile = $request->files->get('media')) {
            // Delete old media if exists
            if ($post->getMedia()) {
            $oldFilePath = $this->getParameter('kernel.project_dir') . '/public/uploads/' . $post->getMedia();
            if (file_exists($oldFilePath)) {
                unlink($oldFilePath);
            }
            }
            
            // Process and save new media file
            $originalFilename = pathinfo($mediaFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = transliterator_transliterate(
            'Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()',
            $originalFilename
            );
            $newFilename = $safeFilename.'-'.uniqid().'.'.$mediaFile->guessExtension();
            
            try {
            $mediaFile->move(
                $this->getParameter('kernel.project_dir').'/public/uploads',
                $newFilename
            );
            $post->setMedia($newFilename);
            } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to upload file'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        $entityManager->flush();

        return new JsonResponse(['message' => 'Post updated'], Response::HTTP_OK);
    }

    
}