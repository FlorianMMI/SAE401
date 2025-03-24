<?php

namespace App\Dto\Payload;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints as Assert;

class CreateUserPayload extends Constraint
{
    #[Assert\NotBlank(message: 'Le mot de passe est obligatoire')]
    #[Assert\Length(min: 8, minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères')]
    #[Assert\Regex(pattern: '/[A-Z]/', message: 'Le mot de passe doit contenir au moins une lettre majuscule')]
    #[Assert\Regex(pattern: '/[0-9]/', message: 'Le mot de passe doit contenir au moins un chiffre')]
    #[Assert\Regex(pattern: '/[\W_]/', message: 'Le mot de passe doit contenir au moins un caractère spécial')]
    private string $password;

    public function __construct(string $password)
    {
        $this->password = $password;
    }

    public function getPassword(): string
    {
        return $this->password;
    }
}