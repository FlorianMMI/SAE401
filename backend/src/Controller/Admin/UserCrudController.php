<?php

namespace App\Controller\Admin;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\Response;

class UserCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return User::class;
    }
    public function configureActions(Actions $actions): Actions
    {
        $toggleBlock = Action::new('toggleBlock', 'Bloquer/Débloquer')
            ->linkToCrudAction('toggleBlock')
            ->displayAsButton();

        return $actions
            ->add(Crud::PAGE_INDEX, $toggleBlock)
            ->add(Crud::PAGE_DETAIL, $toggleBlock);
    }
    
    public function toggleBlock(AdminContext $context, EntityManagerInterface $em, AdminUrlGenerator $adminUrlGenerator): Response
    {
        // Get the User entity from the context
        $entityId = $context->getRequest()->query->get('entityId');
        $user = $em->find(User::class, $entityId);
        
        if (!$user) {
            throw $this->createNotFoundException('User not found');
        }
        
        // Toggle the isBlocked field
        $user->setIsBlocked(!$user->isBlocked());
        
        // Save changes
        $em->flush();
        
        // Redirect back to the index page
        $url = $adminUrlGenerator
            ->setController(self::class)
            ->setAction(Action::INDEX)
            ->generateUrl();
        
        return $this->redirect($url);
    }
    
    /*
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id'),
            TextField::new('title'),
            TextEditorField::new('description'),
        ];
    }
    */
}
