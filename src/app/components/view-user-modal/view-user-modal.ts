import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../../models/user';
import {DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-view-user-modal',
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './view-user-modal.html',
  styleUrl: './view-user-modal.css',
})
export class ViewUserModal {
  @Input() user!: User;
  @Input() isVisible = false;

  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
