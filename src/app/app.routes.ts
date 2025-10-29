import { Routes } from '@angular/router';
import { Home } from './component/home/home';
import { Shop } from './component/shop/shop';
import { About } from './component/about/about';
import { Contact } from './component/contact/contact';
import { Signin } from './component/signin/signin';
import { User } from './component/user/user';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home, title: 'Home' },
  { path: 'shop', component: Shop,title: 'Shop' },
  { path: 'about', component: About, title: 'About Us' },
  { path: 'contact',component: Contact, title: 'Contact Us' },
  { path: 'signin', component: Signin, title: 'Sign In' },
  {path: 'user', component: User, title: 'User Profile' },
  { path: '**', redirectTo: '' }
];