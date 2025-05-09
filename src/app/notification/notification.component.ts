import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  @Input() notificationType: 'supplier' | 'worker' = 'supplier';
  @Input() showActions: boolean = true;
  @Output() notificationUpdated = new EventEmitter<void>();
  
  notifications: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.error = null;

    if (this.notificationType === 'supplier') {
      this.notificationService.getSupplierNotifications().subscribe({
        next: (data) => {
          this.notifications = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading supplier notifications', err);
          this.error = 'Failed to load notifications. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.notificationService.getWorkerNotifications().subscribe({
        next: (data) => {
          this.notifications = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading worker notifications', err);
          this.error = 'Failed to load notifications. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  approveNotification(id: number): void {
    this.notificationService.approveNotification(id).subscribe({
      next: () => {
        this.loadNotifications();
        this.notificationUpdated.emit();
      },
      error: (err) => {
        console.error('Error approving notification', err);
        this.error = 'Failed to approve notification. Please try again.';
      }
    });
  }

  rejectNotification(id: number): void {
    this.notificationService.rejectNotification(id).subscribe({
      next: () => {
        this.loadNotifications();
        this.notificationUpdated.emit();
      },
      error: (err) => {
        console.error('Error rejecting notification', err);
        this.error = 'Failed to reject notification. Please try again.';
      }
    });
  }

  deleteNotification(id: number): void {
    if (this.notificationType === 'supplier') {
      this.notificationService.deleteSupplierNotification(id).subscribe({
        next: () => {
          this.loadNotifications();
          this.notificationUpdated.emit();
        },
        error: (err) => {
          console.error('Error deleting supplier notification', err);
          this.error = 'Failed to delete notification. Please try again.';
        }
      });
    } else {
      this.notificationService.deleteWorkerNotification(id).subscribe({
        next: () => {
          this.loadNotifications();
          this.notificationUpdated.emit();
        },
        error: (err) => {
          console.error('Error deleting worker notification', err);
          this.error = 'Failed to delete notification. Please try again.';
        }
      });
    }
  }
}
