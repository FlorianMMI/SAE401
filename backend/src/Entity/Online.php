<?php

namespace App\Entity;

use App\Repository\OnlineRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OnlineRepository::class)]
class Online
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 280)]
    private ?string $token = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $id_user = null;

    #[ORM\Column]
    private ?int $id_user_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): static
    {
        $this->token = $token;

        return $this;
    }

    public function getIdUser(): ?User
    {
        return $this->id_user;
    }

    public function setIdUser(User $id_user): static
    {
        $this->id_user = $id_user;

        return $this;
    }

    public function getIdUserId(): ?int
    {
        return $this->id_user_id;
    }

    public function setIdUserId(int $id_user_id): static
    {
        $this->id_user_id = $id_user_id;

        return $this;
    }
}
