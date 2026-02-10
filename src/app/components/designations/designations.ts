import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DesignationCreate, DesignationResponse } from '../../models/designation.model';
import { DesignationService } from '../../services/designation.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-designations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designations.html',
  styleUrl: './designations.css',
})
export class Designations implements OnInit {

  designations: DesignationResponse[] = [];
  filteredDesignation: DesignationResponse[] = [];

  showAddModal = false;
  searchTerm: string = '';
  isLoading = false;

  newDesignation: DesignationCreate = {
    name: '',
    level: 0
  };

  totalDesignations = 0;
  maxLevel = 0;
  totalLevels = 0;


  constructor(
    private designationService: DesignationService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadDesignations();
  }

  loadDesignations(): void {
    this.isLoading = true;
    this.designationService.getAllDesignation().subscribe({
      next: (data) => {
        this.designations = data || [];
        this.filterDesignations();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading designations:', error);
        this.toastr.error('Failed to load designations. Please ensure the backend is running.', 'Error');
        this.cdr.detectChanges();
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
        this.resetForm();
        this.loadDesignations();
      },
      error: (error) => {
        this.toastr.error('Failed to create designation', 'Error');
      }
    })
  }

  resetForm(): void {
    this.newDesignation = {
      name: '',
      level: 0
    };
  }

  filterDesignations(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDesignation = [...this.designations];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredDesignation = this.designations.filter(designation =>
      designation.name.toLowerCase().includes(term) ||
      designation.level.toString().includes(term)
    );
  }

}
