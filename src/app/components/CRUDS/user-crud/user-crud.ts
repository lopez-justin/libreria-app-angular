import { Component } from '@angular/core';
import {User} from '../../../models/user';
import { UserService } from '../../../services/user-service';
import {ColumnConfig, DataTable} from '../../shared/data-table/data-table';
import {ConfirmModalComponent} from '../../shared/confirm-modal/confirm-modal';
import {ViewUserModal} from '../../view-user-modal/view-user-modal';
import {EditUserModal} from '../../edit-user-modal/edit-user-modal';

@Component({
  selector: 'app-user-crud',
  imports: [
    DataTable,
    ConfirmModalComponent,
    ViewUserModal,
    EditUserModal
  ],
  templateUrl: './user-crud.html',
  styleUrl: './user-crud.css',
})
export class UserCrud {

  users: User[] = [];
  loading = false;

  selectedUser?: User;
  userToDelete?: User;

  showViewModal = false;
  showEditModal = false;
  showDeleteModal = false;

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Nombre',
      sortable: true
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true
    },
    {
      key: 'active',
      header: 'Estado',
      type: 'badge',
      format: (value: boolean) => value ? 'Activo' : 'Inactivo'
    }
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openNewUser() {
    this.selectedUser = {
      name: '',
      email: '',
      role: 'user',
      active: true
    } as User;
    this.showEditModal = true;
  }

  onViewUser(user: User) {
    this.selectedUser = user;
    this.showViewModal = true;
  }

  onEditUser(user: User) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  onDeleteUser(user: User) {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  onSaveUser(user: User) {
    const request = user.id
      ? this.userService.update(user)
      : this.userService.create(user);

    // @ts-ignore
    request.subscribe({
      next: () => {
        this.closeEditModal();
        this.loadUsers();
      }
    });
  }

  confirmDelete() {
    if (!this.userToDelete) return;

    this.userService.deactivate(this.userToDelete.id!).subscribe({
      next: () => {
        this.cancelDeleteModal();
        this.loadUsers();
      }
    });
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedUser = undefined;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = undefined;
  }

  cancelDeleteModal() {
    this.showDeleteModal = false;
    this.userToDelete = undefined;
  }
}
