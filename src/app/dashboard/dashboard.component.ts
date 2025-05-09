import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
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

  constructor(private http: HttpClient, private router: Router) {}

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
      .subscribe(
        users => {
          this.users = users;
        },
        error => {
          console.error('Error fetching users', error);
        }
      );

      // Fetch pending users
      this.http.get<any[]>('http://localhost:8080/api/admin/users/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .subscribe(
        pendingUsers => {
          this.pendingUsers = pendingUsers;
        },
        error => {
          console.error('Error fetching pending users', error);
        }
      );

       // Fetch all items
       this.http.get<any[]>('http://localhost:8080/api/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .subscribe(
        items => {
          this.items = items;
        },
        error => {
          console.error('Error fetching items', error);
        }
      );

      // Fetch all suppliers
      this.http.get<any[]>('http://localhost:8080/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .subscribe(
        suppliers => {
          this.suppliers = suppliers;
        },
        error => {
          console.error('Error fetching suppliers', error);
        }
      );

      // Fetch supplier notifications
      this.http.get<any[]>('http://localhost:8080/api/notifications/supplier', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .subscribe(
        supplierNotifications => {
          this.supplierNotifications = supplierNotifications;
        },
        error => {
          console.error('Error fetching supplier notifications', error);
        }
      );
    }
  }

  approveNotification(notificationId: number) {
    const token = localStorage.getItem('token');
    // TODO: Implement logic to approve the notification
    console.log(`Approve notification with ID: ${notificationId}`);
  }

  deleteItem(itemId: number) {
    const token = localStorage.getItem('token');
    this.http.delete(`http://localhost:8080/api/items/${itemId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      () => {
        console.log('Item deleted successfully');
        // Refresh the list of items
        this.ngOnInit();
      },
      error => {
        console.error('Error deleting item', error);
      }
    );
  }

  addRole(userId: number, role: string) {
    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8080/api/admin/users/${userId}/approve`, [role], {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      () => {
        console.log('Role added successfully');
        // Refresh the list of users
        this.ngOnInit();
      },
      error => {
        console.error('Error adding role', error);
      }
    );
  }

  approveUser(userId: number) {
    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8080/api/admin/users/${userId}/approve`, ["ROLE_USER"], {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      () => {
        console.log('User approved successfully');
        // Refresh the list of users
        this.ngOnInit();
      },
      error => {
        console.error('Error approving user', error);
      }
    );
  }

  deleteUser(userId: number) {
    const token = localStorage.getItem('token');
    this.http.delete(`http://localhost:8080/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      () => {
        console.log('User deleted successfully');
        // Refresh the list of users
        this.ngOnInit();
      },
      error => {
        console.error('Error deleting user', error);
      }
    );
  }
}
