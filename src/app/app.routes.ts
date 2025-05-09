import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { WorkerDashboardComponent } from './worker-dashboard/worker-dashboard.component';
import { SupplierDashboardComponent } from './supplier-dashboard/supplier-dashboard.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: 'edit-item/:id', component: EditItemComponent },
  { path: 'teacher-dashboard', component: TeacherDashboardComponent, canActivate: [() => {
    const role = localStorage.getItem('role');
    return role === 'TEACHER';
  }] },
  { path: 'worker-dashboard', component: WorkerDashboardComponent, canActivate: [() => {
    const role = localStorage.getItem('role');
    return role === 'WORKER';
  }] },
  { path: 'supplier-dashboard', component: SupplierDashboardComponent, canActivate: [() => {
    const role = localStorage.getItem('role');
    return role === 'SUPPLIER';
  }] },
  { path: 'add-supplier', component: AddSupplierComponent, canActivate: [() => {
    const role = localStorage.getItem('role');
    return role === 'ADMIN';
  }] }
];
