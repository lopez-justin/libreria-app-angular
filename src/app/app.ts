import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NotificationToast} from './components/shared/notification-toast/notification-toast';
import {AuthService} from './services/auth-service';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NotificationToast,
    TitleCasePipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(public auth: AuthService) {}

  title = 'libreria_app';
}
