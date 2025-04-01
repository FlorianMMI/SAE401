<?php

namespace App\Controller\Admin;

use App\Entity\Post;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\UX\Chartjs\Builder\ChartBuilderInterface;
use Symfony\UX\Chartjs\Model\Chart;
use Symfony\Component\HttpFoundation\Response;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;

#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
class DashBoardController extends AbstractDashboardController
{

    public function __construct(
        private ChartBuilderInterface $chartBuilder,
    ) {
    }

    public function index(): Response
    {
        $chart = $this->chartBuilder->createChart(Chart::TYPE_LINE);
        // ...set chart data and options somehow

        return $this->render('dashboard.html.twig', [
            'chart' => $chart,
        ]);
    }

    public function configureDashboard(): Dashboard
    {
        
            return Dashboard::new()
                // the name visible to end users
                ->setTitle('SocialName')
                // you can include HTML contents too (e.g. to link to an image)
                ->setTitle('<img src="..."> Social <span class="text-small">Name</span>')
    
                // by default EasyAdmin displays a black square as its default favicon;
                // use this method to display a custom favicon: the given path is passed
                // "as is" to the Twig asset() function:
                // <link rel="shortcut icon" href="{{ asset('...') }}">
                ->setFaviconPath('favicon.svg')
    
                // the domain used by default is 'messages'
                ->setTranslationDomain('my-custom-domain')
    
                // there's no need to define the "text direction" explicitly because
                // its default value is inferred dynamically from the user locale
                ->setTextDirection('ltr')
    
                // set this option if you prefer the page content to span the entire
                // browser width, instead of the default design which sets a max width
                ->renderContentMaximized()
    
                // set this option if you prefer the sidebar (which contains the main menu)
                // to be displayed as a narrow column instead of the default expanded design
                ->renderSidebarMinimized()
    
                // by default, users can select between a "light" and "dark" mode for the
                // backend interface. Call this method if you prefer to disable the "dark"
                // mode for any reason (e.g. if your interface customizations are not ready for it)
                ->disableDarkMode()
    
               
                ->setDefaultColorScheme('dark')
                
                ->generateRelativeUrls()
    
                ->setLocales(['en', 'pl'])
                
                ->setLocales([
                    'en' => '🇬🇧 English',
                    'pl' => '🇵🇱 Polski'
                ])
                // to further customize the locale option, pass an instance of
                // EasyCorp\Bundle\EasyAdminBundle\Config\Locale
                ->setLocales([
                    'en', // locale without custom options
                ])
            ;
        
    }

    public function configureCrud(): Crud
    {
        return Crud::new()
            // set the page title to Dashboard
            ->setPageTitle('index', 'Dashboard')
            ->setDateFormat('d/m/Y')
            // set the default page title to "Dashboard"
            ->setPageTitle('index', 'Dashboard')
            // set the default page title to "Dashboard"
            ->setPageTitle('new', 'Create new %entity_label%')
            // set the default page title to "Dashboard"
            ->setPageTitle('edit', 'Edit %entity_label%')
            // set the default page title to "Dashboard"
            ->setPageTitle('detail', '%entity_label% details')
            
        ;
    }

    public function configureMenuItems(): iterable
    {
        return [
            MenuItem::linkToDashboard('Dashboard', 'fa fa-home'),
            MenuItem::section('Users'),
            MenuItem::linkToCrud('User', 'fa fa-user', User::class),
            MenuItem::section('Posts'),
            MenuItem::linkToCrud('Post', 'fa fa-post', Post::class),
        ];
        
    }
}
