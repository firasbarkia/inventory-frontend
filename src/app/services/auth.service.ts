import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model'; // Assuming a User model

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    // Load initial user from local storage or wherever it's stored
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(user: User): void {
    // In a real application, this would involve an HTTP request to your backend
    // and storing the received token/user information.
    // For this example, we'll just simulate a login.
    // In a real application, this would involve an HTTP request to your backend
    // and storing the received token/user information.
    // For this example, we'll just simulate a login.
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    // In a real application, this might involve an HTTP request to invalidate the token.
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
