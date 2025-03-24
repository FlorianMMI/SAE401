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

    public function create_token(array $data, EntityManagerInterface $entityManager): Online{
        $userid = $data['id'];
        $token = bin2hex(random_bytes(32));
        // Fetch the User entity corresponding to $userid
        $user = $entityManager->getRepository(User::class)->find($userid);
        $Online = new Online();
        $Online->setToken($token);
        $Online->setIdUser($user);
        $entityManager->persist($Online);
        $entityManager->flush();
        return $Online;
    }

}



class AccessTokenHandler extends AbstractAuthenticator {
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager){
        $this->entityManager = $entityManager;
    }

    public function supports(Request $request): ?bool {
        return $request->headers->has('Authorization');
    }
    public function authenticate(Request $request): Passport {
        $token = $request->headers->get('Authorization');
        $online = $this->entityManager->getRepository(Online::class)->findOneBy(['token' => $token]);
        if (!$online) {
            throw new \Exception('Invalid token');
        }
        dump();
        return new SelfValidatingPassport(new UserBadge($online->getIdUser()->getUserIdentifier()));
    }
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response {
        return new Response("Authentication Failed", Response::HTTP_UNAUTHORIZED);

    
    }
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response {
        return null;
    }
}




?>