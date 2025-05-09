import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all supplier notifications
  getSupplierNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/supplier`, {
      headers: this.getHeaders()
    });
  }

  // Get all worker notifications
  getWorkerNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/worker`, {
      headers: this.getHeaders()
    });
  }

  // Approve a notification
  approveNotification(notificationId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/supplier/${notificationId}/approve`, {}, {
      headers: this.getHeaders()
    });
  }

  // Reject a notification
  rejectNotification(notificationId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/supplier/${notificationId}/reject`, {}, {
      headers: this.getHeaders()
    });
  }

  // Delete a supplier notification
  deleteSupplierNotification(notificationId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/supplier/${notificationId}`, {
      headers: this.getHeaders()
    });
  }

  // Delete a worker notification
  deleteWorkerNotification(notificationId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/worker/${notificationId}`, {
      headers: this.getHeaders()
    });
  }

  // Check low stock for an item and create notification if needed
  checkLowStock(itemId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/supplier/check-low-stock/${itemId}`, {}, {
      headers: this.getHeaders()
    });
  }

  // Create a request notification for workers
  createRequestNotification(requestId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/worker/request-notification/${requestId}`, {}, {
      headers: this.getHeaders()
    });
  }
}
