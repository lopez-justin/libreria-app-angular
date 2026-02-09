import { Component } from '@angular/core';
import { User } from '../../models/user';
import {UserService} from '../../services/user-service';
import {AuthService} from '../../services/auth-service';
import {FormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';

@Component({
  selector: 'app-my-profile',
  imports: [
    CommonModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {

  user!: User;
  isEditing = false;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = Number.parseInt(this.authService.getUserIdFromToken());
    this.loadUser(userId);
  }

  loadUser(id: number) {
    this.userService.getById(id).subscribe({
      next: (data) => this.user = data
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadUser(this.user.id!);
  }

  saveChanges() {
    this.userService.update(this.user).subscribe({
      next: () => {
        this.isEditing = false;
        alert('Perfil actualizado correctamente');
      }
    });
  }

}
