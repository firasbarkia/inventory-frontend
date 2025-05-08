import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Item } from '../models/item.model';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { Supplier } from '../models/supplier.model';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  suppliers: any[] = []; // Assuming a Supplier model exists or using 'any' for simplicity

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ItemFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item,
    private http: HttpClient
  ) {
    this.itemForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      minStockLevel: [0, [Validators.required, Validators.min(0)]],
      supplierId: [null, Validators.required]
    });

    if (data) {
      this.itemForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.http.get<any[]>('/api/suppliers').subscribe(
      (data) => {
        this.suppliers = data;
      },
      (error) => {
        console.error('Error loading suppliers:', error);
      }
    );
  }

  onSave(): void {
    if (this.itemForm.valid) {
      this.dialogRef.close(this.itemForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
