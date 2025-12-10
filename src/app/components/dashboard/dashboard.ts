import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardItem } from '../../models/dashboard-item';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  crudItems: DashboardItem[] = [
    {
      id: 1,
      title: 'Libros',
      description: 'Gestión de libros disponibles',
      icon: 'bi-book',
      route: '/crud/books',
      color: 'primary'
    },
    {
      id: 2,
      title: 'Usuarios',
      description: 'Administración de usuarios',
      icon: 'bi-people',
      route: '/crud/users',
      color: 'success'
    },
    {
      id: 3,
      title: 'Categorías',
      description: 'Categorías de libros',
      icon: 'bi-tags',
      route: '/crud/categories',
      color: 'warning'
    },
    {
      id: 4,
      title: 'Reseñas',
      description: 'Comentarios y calificaciones',
      icon: 'bi-star',
      route: '/crud/reviews',
      color: 'info'
    },
    {
      id: 5,
      title: 'Transacciones',
      description: 'Ventas y donaciones',
      icon: 'bi-cash-coin',
      route: '/crud/transactions',
      color: 'danger'
    },
    {
      id: 6,
      title: 'Favoritos',
      description: 'Libros favoritos de usuarios',
      icon: 'bi-heart',
      route: '/crud/favorites',
      color: 'secondary'
    }
  ];

  quickActions = [
    { title: 'Ver Catálogo', icon: 'bi-grid', route: '/book-list', color: 'primary' },
    { title: 'Nuevo Libro', icon: 'bi-plus-circle', route: '/book-form', color: 'success' },
    { title: 'Mis Favoritos', icon: 'bi-heart', route: '/crud/favorites', color: 'danger' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getBadgeClass(color: string): string {
    const colorClasses: { [key: string]: string } = {
      'primary': 'bg-primary',
      'success': 'bg-success',
      'warning': 'bg-warning',
      'info': 'bg-info',
      'danger': 'bg-danger',
      'secondary': 'bg-secondary'
    };
    return colorClasses[color] || 'bg-primary';
  }

  getTextClass(color: string): string {
    const colorClasses: { [key: string]: string } = {
      'primary': 'text-primary',
      'success': 'text-success',
      'warning': 'text-warning',
      'info': 'text-info',
      'danger': 'text-danger',
      'secondary': 'text-secondary'
    };
    return colorClasses[color] || 'text-primary';
  }
}