import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supplier } from '../models/supplier.model';
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.css'
})
export class SupplierFormComponent implements OnInit, OnChanges {
  @Input() supplier: Supplier | null = null;
  @Output() formClosed = new EventEmitter<void>();

  currentSupplier: Supplier = { id: 0, name: '', contactInfo: '', email: '', userId: 0 };
  isEditMode = false;

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    // Initialize form if needed on component init
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplier'] && changes['supplier'].currentValue) {
      this.currentSupplier = { ...changes['supplier'].currentValue };
      this.isEditMode = true;
    } else {
      this.currentSupplier = { id: 0, name: '', contactInfo: '', email: '', userId: 0 };
      this.isEditMode = false;
    }
  }

  saveSupplier(): void {
    if (this.isEditMode) {
      this.supplierService.updateSupplier(this.currentSupplier.id, this.currentSupplier).subscribe(
        () => {
          console.log('Supplier updated successfully');
          this.closeForm();
        },
        (error) => {
          console.error('Error updating supplier:', error);
          // Handle error
        }
      );
    } else {
      this.supplierService.createSupplier(this.currentSupplier).subscribe(
        () => {
          console.log('Supplier created successfully');
          this.closeForm();
        },
        (error) => {
          console.error('Error creating supplier:', error);
          // Handle error
        }
      );
    }
  }

  closeForm(): void {
    this.formClosed.emit();
  }
}
