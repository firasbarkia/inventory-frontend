import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  availableRoles: string[] = ['ADMIN', 'SUPPLIER', 'WORKER']; // Example roles
  accountStatuses: string[] = ['PENDING', 'ACTIVE', 'INACTIVE']; // Example statuses

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data.id;
    this.userForm = this.fb.group({
      id: [this.data.id],
      username: [this.data.username || '', Validators.required],
      email: [this.data.email || '', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : Validators.required], // Password required only for creation
      roles: [this.data.roles || [], Validators.required],
      status: [this.data.status || 'PENDING', Validators.required]
    });

    // Disable status and roles fields for non-admin users or if not in edit mode (except for initial pending status)
    // This logic might need refinement based on actual role management requirements
    // if (!this.isEditMode) {
    //    this.userForm.get('status')?.disable();
    //    this.userForm.get('roles')?.disable();
    // } else {
    //    // Further logic might be needed here to restrict changes based on user's own roles
    // }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      // Remove password if in edit mode and not changed
      if (this.isEditMode && !this.userForm.get('password')?.dirty) {
        delete user.password; // Assuming backend handles password update only if provided
      }
      this.dialogRef.close(user);
    }
  }
}
