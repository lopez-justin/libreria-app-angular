import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NotificationToast} from './components/shared/notification-toast/notification-toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NotificationToast
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'libreria_app';
}
