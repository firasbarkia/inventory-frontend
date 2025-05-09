import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NotificationComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  username: string | null = null;
  role: string | null = null;
  users: any[] = [];
  pendingUsers: any[] = [];
  selectedRole: { [userId: number]: string } = {};
  items: any[] = [];
  suppliers: any[] = [];
  selectedSupplier: number = 0;
  supplierNotifications: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');

    if (this.role === 'TEACHER') {
      this.router.navigate(['/teacher-dashboard']);
      return;
    }

    if (this.role === 'WORKER') {
      this.router.navigate(['/worker-dashboard']);
      return;
    }

    if (this.role === 'ADMIN' || this.role === 'SUPPLIER') {
      const token = localStorage.getItem('token');

      // Fetch all users
      this.http.get<any[]>('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          console.error('Error fetching users', error);
        }
      });

      // Fetch pending users
      this.http.get<any[]>('http://localhost:8080/api/admin/users/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .subscribe({
        next: (pendingUsers) => {
          this.pendingUsers = pendingUsers;
        },
        error: (error) => {
          console.error('Error fetching pending users', error);
        }
      });

       // Fetch all items
       this.http.get<any[]>('http://localhost:8080/api/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .subscribe({
        next: (items) => {
          this.items = items;
        },
        error: (error) => {
          console.error('Error fetching items', error);
        }
      });

      // Fetch all suppliers
      this.http.get<any[]>('http://localhost:8080/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
        },
        error: (error) => {
          console.error('Error fetching suppliers', error);
        }
      });

      // Fetch supplier notifications
      this.loadSupplierNotifications();
    }
  }

  approveNotification(notificationId: number) {
    this.notificationService.approveNotification(notificationId).subscribe({
      next: () => {
        console.log(`Notification ${notificationId} approved successfully`);
        // Refresh notifications
        this.loadSupplierNotifications();
      },
      error: (error) => {
        console.error('Error approving notification', error);
      }
    });
  }

  loadSupplierNotifications() {
    this.notificationService.getSupplierNotifications().subscribe({
      next: (notifications) => {
        this.supplierNotifications = notifications;
      },
      error: (error) => {
        console.error('Error fetching supplier notifications', error);
      }
    });
  }

  deleteItem(itemId: number) {
    const token = localStorage.getItem('token');
    this.http.delete(`http://localhost:8080/api/items/${itemId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe({
      next: () => {
        console.log('Item deleted successfully');
        // Refresh the list of items
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error deleting item', error);
      }
    });
  }

  addRole(userId: number, role: string) {
    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8080/api/admin/users/${userId}/approve`, [role], {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe({
      next: () => {
        console.log('Role added successfully');
        // Refresh the list of users
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error adding role', error);
      }
    });
  }

  approveUser(userId: number) {
    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8080/api/admin/users/${userId}/approve`, ["ROLE_USER"], {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe({
      next: () => {
        console.log('User approved successfully');
        // Refresh the list of users
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error approving user', error);
      }
    });
  }

  deleteUser(userId: number) {
    const token = localStorage.getItem('token');
    this.http.delete(`http://localhost:8080/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe({
      next: () => {
        console.log('User deleted successfully');
        // Refresh the list of users
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error deleting user', error);
      }
    });
  }
}
