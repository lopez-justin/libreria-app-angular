import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../../models/user';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-edit-user-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './edit-user-modal.html',
  styleUrl: './edit-user-modal.css',
})
export class EditUserModal {
  @Input() user!: User;
  @Input() isVisible = false;

  @Output() saveUser = new EventEmitter<User>();
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  save() {
    this.saveUser.emit(this.user);
  }
}
