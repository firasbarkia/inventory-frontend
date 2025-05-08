import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ItemsComponent } from './items/items.component';
import { UsersComponent } from './users/users.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RequestsComponent } from './requests/requests.component';
import { authGuard } from './services/auth.guard'; // Assuming you have an auth guard

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'suppliers', component: SuppliersComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'requests', component: RequestsComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' }
];
