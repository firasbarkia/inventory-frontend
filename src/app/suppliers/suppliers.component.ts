import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../services/supplier.service';
import { Supplier } from '../models/supplier.model';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SupplierFormComponent,
    MatCardModule, // Add MatCardModule
    MatTableModule, // Add MatTableModule
    MatButtonModule, // Add MatButtonModule
    MatIconModule // Add MatIconModule
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  selectedSupplier: Supplier | null = null;
  showForm = false;

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(
      (data: Supplier[]) => {
        this.suppliers = data;
      },
      (error) => {
        console.error('Error fetching suppliers:', error);
        // Handle error (e.g., show an error message)
      }
    );
  }

  openAddForm(): void {
    this.selectedSupplier = null; // Clear selected supplier for add
    this.showForm = true;
  }

  openEditForm(supplier: Supplier): void {
    this.selectedSupplier = { ...supplier }; // Create a copy to avoid modifying the list directly
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedSupplier = null;
    this.loadSuppliers(); // Reload suppliers after form is closed (assuming changes were made)
  }

  deleteSupplier(id: number): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id).subscribe(
        () => {
          console.log('Supplier deleted successfully');
          this.loadSuppliers(); // Reload suppliers after deletion
        },
        (error) => {
          console.error('Error deleting supplier:', error);
          // Handle error
        }
      );
    }
  }
}
