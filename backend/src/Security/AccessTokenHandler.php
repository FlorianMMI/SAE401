<?php
namespace App\Security;
use App\Repository\OnlineRepository;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use App\Entity\Online;

class AccessTokenHandler implements AccessTokenHandlerInterface
{
    public function __construct(
        private OnlineRepository $repository
    ) {
    }

    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        // e.g. query the "access token" database to search for this token
        /** @var Online|null $accessToken */
        $accessToken = $this->repository->findOneByToken($accessToken);
        if (null === $accessToken ) {
            throw new BadCredentialsException('Invalid credentials.');
        }

        // and return a UserBadge object containing the user identifier from the found token
        // (this is the same identifier used in Security configuration; it can be an email,
        // a UUID, a username, a database ID, etc.)
        return new UserBadge($accessToken->getIdUser()->getEmail());
    }
}





