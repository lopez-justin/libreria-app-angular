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


export const routes: Routes = [
  { path: "home", component: Home },
  { path: "book-list", component: BookList },
  { path: "dashboard", component: Dashboard },
  { path: "book-details/:id", component: BookDetails },
  { path: "book-form", component: BookForm },
  { path: "crud/books", component: BookCrud },
  { path: "crud/transactions", component: TransactionCrud },
  { path: "crud/categories", component: CategoryCrud },
  { path: "crud/favorites", component: Favorites},

  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "**", redirectTo: "home" },
];
