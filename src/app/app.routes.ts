import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.page').then((m) => m.AboutPage),
  },
   {
    path: 'mycoupans',
    loadComponent: () => import('./mycoupans/mycoupans.page').then((m) => m.MyCouponsPage),
  },
  {
    path: 'dashboard',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./tabs/hometab/home-tab.page').then((m) => m.HomeTabPage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./tabs/searchtab/search-tab.page').then((m) => m.SearchTabPage),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./tabs/notificationstab/notifications-tab.page').then(
            (m) => m.NotificationsTabPage
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./tabs/profiletab/profile-tab.page').then((m) => m.ProfileTabPage),
      },
    ],
  },
  {
    path: 'pastevents',
    loadComponent: () => import('./pastevents/pastevents.page').then( m => m.PasteventsPage)
  },
];
