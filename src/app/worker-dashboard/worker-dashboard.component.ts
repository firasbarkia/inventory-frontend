import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NotificationComponent],
  templateUrl: './worker-dashboard.component.html',
  styleUrl: './worker-dashboard.component.css'
})
export class WorkerDashboardComponent implements OnInit {
  username: string | null = null;
  role: string | null = null;
  notifications: any[] = [];
  requests: any[] = [];

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');

    // Fetch worker notifications
    this.loadWorkerNotifications();

    // Fetch requests assigned to the current worker
    this.fetchRequests();
  }

  loadWorkerNotifications() {
    this.notificationService.getWorkerNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error fetching worker notifications', error);
      }
    });
  }

  fetchRequests() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    this.http.get<any[]>(`http://localhost:8080/api/requests?worker=${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe({
      next: (requests) => {
        this.requests = requests;
      },
      error: (error) => {
        console.error('Error fetching requests', error);
      }
    });
  }

  updateRequestStatus(requestId: number) {
    const token = localStorage.getItem('token');
    const requestData = {
      status: 'APPROVED' // Default status
    };

    this.http.put(`http://localhost:8080/api/requests/${requestId}`, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe({
      next: () => {
        console.log('Request status updated successfully');
        this.fetchRequests(); // Refresh requests
      },
      error: (error) => {
        console.error('Error updating request status', error);
      }
    });
  }
}
