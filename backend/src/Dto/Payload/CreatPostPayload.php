<?php

namespace App\Dto\Payload;

use Symfony\Component\Validator\Constraints as Assert;

class CreatePostPayload
{
    #[Assert\NotBlank(message: 'Le message est obligatoire')]
    #[Assert\Length(
        min : 2,
        max: 280,
        maxMessage: 'Le message ne doit pas dépasser {{ limit }} caractères'
    )]
    private string $content;

    public function __construct(string $content)
    {
        $this->content = $content;
    }

    public function getContent(): string
    {
        return $this->content;
    }
}