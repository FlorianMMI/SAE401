<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\Reply;
use App\Service\ReplyService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class ReplyController extends AbstractController
{
    #[Route('/post/{id}/reply', name: 'post_reply', methods: ['POST'], format: 'json')]
    public function replyPost(Request $request, Post $post, EntityManagerInterface $entityManager, ReplyService $replyService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $content = $data['message'] ?? null;

        if (!$content) {
            return new JsonResponse(['error' => 'Message is required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Call the ReplyService to create the reply using the auto-converted Post
        $reply = $replyService->createReply($content, $request, $entityManager, $post);

        return new JsonResponse(['message' => 'Reply created', 'reply' => $reply], JsonResponse::HTTP_CREATED);
    }

    #[Route('/post/{id}/reply', name: 'post_reply_list', methods: ['GET'], format: 'json')]
    public function listReplies(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $post = $entityManager->getRepository(Post::class)->find($id);

        if (!$post) {
            return new JsonResponse(['error' => 'Post not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $replies = $entityManager->getRepository(Reply::class)->findBy(['post' => $post]);

        $normalizedReplies = array_map(function(Reply $reply) {
            return [
            'id'      => $reply->getId(),
            'post'    => $reply->getPost()->getId(),
            'author'  => $reply->getAuthor(),
            'message' => $reply->getMessage(),
            'created_at' => $reply->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }, $replies);

        return new JsonResponse(['replies' => $normalizedReplies], JsonResponse::HTTP_OK);
    }
}
?>
