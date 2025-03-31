<?php

namespace App\Repository;

use App\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * @extends ServiceEntityRepository<Post>
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    public function paginateAllOrderedByLatest($offset, $count): Paginator
    {
        $query = $this->createQueryBuilder('p')
            ->orderBy('p.created_at', 'DESC')
            ->setFirstResult($offset) // offset
            ->setMaxResults($count ) // limit
            ->getQuery()
        ;

        return new Paginator($query);
    }


    public function findPostsFromFollowedUsers($user, int $offset, int $limit): array
    {
        // Extract followed user IDs from the provided user object.
        $followedUserIds = [];
        foreach ($user->getFollower() as $followedUser) {
            
            $followedUserIds[] = $followedUser->getId();
        }
       
        return $this->createQueryBuilder('p')
            ->join('p.user_id', 'a')
            ->where('a.id IN (:followedUserIds)')
            ->setParameter('followedUserIds', $followedUserIds)
            ->orderBy('p.created_at', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
    //    /**
    //     * @return Post[] Returns an array of Post objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Post
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
