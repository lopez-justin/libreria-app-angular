import { Routes } from '@angular/router';

import { BookList } from './components/book-list/book-list';
import { BookDetails } from './components/book-details/book-details';
import { BookForm } from './components/book-form/book-form';
import { Dashboard } from './components/dashboard/dashboard';
import { Home } from './components/home/home';
import { BookCrud } from './components/CRUDS/book-crud/book-crud';
import { TransactionCrud } from './components/CRUDS/transaction-crud/transaction-crud';
import {CategoryCrud} from './components/CRUDS/category-crud/category-crud';
import { Favorites } from './components/CRUDS/favorite-crud/favorite-crud';
import {Login} from './components/login/login';
import {Register} from './components/register/register';
import {MyProfile} from './components/my-profile/my-profile';
import {UserCrud} from './components/CRUDS/user-crud/user-crud';
import {AuthGuard} from './guard/auth.guard';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: "home", component: Home },
  { path: "book-list", component: BookList },
  { path: "dashboard", component: Dashboard },
  { path: "book-details/:id", component: BookDetails },
  { path: "book-form", component: BookForm },
  { path: "crud/books", component: BookCrud },
  { path: "crud/transactions", component: TransactionCrud },
  { path: "crud/categories", component: CategoryCrud },
  { path: "crud/favorites", component: Favorites},
  { path: "crud/users", component: UserCrud, canActivate: [AuthGuard], data: { roles: ['admin', 'editor'] } },
  { path: "profile", component: MyProfile },

  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "**", redirectTo: "home" },
];
