import { Component, OnInit, inject, signal } from '@angular/core';
import { DesignationCreate, DesignationResponse } from '../../models/designation.model';
import { DesignationService } from '../../services/designation.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-designations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designations.html',
  styleUrl: './designations.css',
})
export class Designations implements OnInit {
  private designationService = inject(DesignationService);
  private toastr = inject(ToastrService);

  designations = signal<DesignationResponse[]>([]);
  filteredDesignations = signal<DesignationResponse[]>([]);
  showAddModal = false;
  searchTerm: string = '';

  newDesignation: DesignationCreate = {
    name: '',
    level: 0
  };

  ngOnInit(): void {
    this.loadDesignations();
  }

  loadDesignations(): void {
    this.designationService.getAllDesignation().subscribe({
      next: (data) => {
        const list = data || [];
        this.designations.set(list);
        this.filterDesignations();
      },
      error: (error) => {
        console.error('Error loading designations:', error);
        this.toastr.error('Failed to load designations.', 'Error');
      }
    });
  }

  openAddModal() {
    this.showAddModal = true;
    this.resetForm();
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  createDesignation(): void {
    this.designationService.createDesignation(this.newDesignation).subscribe({
      next: () => {
        this.toastr.success('Designation created successfully', 'Success');
        this.closeAddModal();
        this.loadDesignations();
      },
      error: () => this.toastr.error('Failed to create designation', 'Error')
    });
  }

  resetForm(): void {
    this.newDesignation = { name: '', level: 0 };
  }

  filterDesignations(): void {
    const list = this.designations();
    if (!this.searchTerm.trim()) {
      this.filteredDesignations.set(list);
      return;
    }

    const term = this.searchTerm.toLowerCase();
    const filtered = list.filter(d =>
      d.name.toLowerCase().includes(term) || d.level.toString().includes(term)
    );
    this.filteredDesignations.set(filtered);
  }
}
