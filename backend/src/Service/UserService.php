<?php
namespace App\Service;



use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Entity\Online;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService extends AbstractController
{
    public function create(array $data, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher): User
    {
        $user = new User();

        $hashedPassword = $userPasswordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        $user->setEmail($data['email']);
        $user->setUsername($data['username']);
        $entityManager->persist($user);
        $entityManager->flush();
        return $user;
    }

    public function create_token(array $data, EntityManagerInterface $entityManager): Online {
        $userid = $data['id'];

        $token = bin2hex(random_bytes(32));
        // Récupérer l'entité User correspondant à $userid
        $user = $entityManager->getRepository(User::class)->find($userid);
        $online = new Online();
        $online->setToken($token);
        $online->setIdUser($user);
        $entityManager->persist($online);
        $entityManager->flush();
        return $online;
    }


    public function findTokenByUser($id, $entityManager): ?Online
    {
        $onlineRepo = $entityManager->getRepository(Online::class);
        $online = $onlineRepo->findOneBy(['idUser' => $id]);
        return $online;
    }

    public function patchToken($online, $data, $entityManager): Online
    {
        $token = bin2hex(random_bytes(32));
        $online->setToken($token);
        $entityManager->persist($online);
        $entityManager->flush();
        return $online;
    }

}

?>