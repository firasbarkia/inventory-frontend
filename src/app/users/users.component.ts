import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { UserFormComponent } from '../user-form/user-form.component'; // Used programmatically in dialog

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    UserFormComponent, // Used programmatically in dialog // AOT compilation requires listing components used programmatically
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'roles', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>();
  currentUser: User | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('Current user in UsersComponent:', this.currentUser); // Add this line
    });
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Received users data:', users); // Log the received data
        this.dataSource.data = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Failed to load users.', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUserFormDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: user ? { ...user } : {} // Pass a copy of the user data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.updateUser(result);
        } else {
          this.createUser(result);
        }
      }
    });
  }

  createUser(user: User): void {
    this.userService.createUser(user).subscribe({
      next: (newUser) => {
        this.snackBar.open('User created successfully!', 'Close', { duration: 3000 });
        this.loadUsers(); // Refresh the table
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.snackBar.open('Failed to create user.', 'Close', { duration: 3000 });
      }
    });
  }

  updateUser(user: User): void {
    this.userService.updateUser(user).subscribe({
      next: (updatedUser) => {
        this.snackBar.open('User updated successfully!', 'Close', { duration: 3000 });
        this.loadUsers(); // Refresh the table
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Failed to update user.', 'Close', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully!', 'Close', { duration: 3000 });
          this.loadUsers(); // Refresh the table
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Failed to delete user.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  approveUser(user: User): void {
    // This will likely require a dialog to select roles before approving
    // For now, a simple confirmation and approval without role selection
    if (confirm(`Are you sure you want to approve user ${user.username}?`)) {
      // Assuming 'WORKER' is a default role upon approval, adjust as needed
      this.userService.approveUser(user.id, ['WORKER']).subscribe({
        next: (approvedUser) => {
          this.snackBar.open('User approved successfully!', 'Close', { duration: 3000 });
          this.loadUsers(); // Refresh the table
        },
        error: (error) => {
          console.error('Error approving user:', error);
          this.snackBar.open('Failed to approve user.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.currentUser?.roles?.includes('ADMIN') || false;
  }

  isPending(user: User): boolean {
    // Assuming AccountStatus is a string property in User model
    return user.status === 'PENDING';
  }
}
