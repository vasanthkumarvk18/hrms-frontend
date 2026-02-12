import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeResponse, EmployeeCreateRequest } from '../../models/employee.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-employee-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './employee-management.component.html',
    styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {
    private employeeService = inject(EmployeeService);
    private toastr = inject(ToastrService);

    employees = signal<EmployeeResponse[]>([]);
    filteredEmployees = signal<EmployeeResponse[]>([]);
    showAddModal = false;
    searchTerm: string = '';

    newEmployee: EmployeeCreateRequest = {
        employeeCode: '', firstName: '', lastName: '', gender: '', dob: '',
        email: '', mobile: '', departmentId: 1, designationId: 1,
        managerId: undefined, dateOfJoining: '', employmentType: '',
        maritalStatus: '', bloodGroup: '', profilePhotoUrl: '', probationEndDate: ''
    };

    stats = computed(() => {
        const empList = this.employees();
        return {
            total: empList.length,
            active: empList.filter(e => e.status === 'ACTIVE').length,
            exited: empList.filter(e => e.status === 'EXITED').length
        };
    });

    ngOnInit(): void {
        this.loadEmployees();
    }

    loadEmployees(): void {
        this.employeeService.getAllEmployees().subscribe({
            next: (data) => {
                this.employees.set(data);
                this.filteredEmployees.set(data);
            },
            error: (error) => {
                console.error('Error loading employees:', error);
                this.toastr.error('Failed to load employees', 'Error');
            }
        });
    }

    openAddModal(): void {
        this.showAddModal = true;
        this.resetForm();
    }

    closeAddModal(): void {
        this.showAddModal = false;
    }

    resetForm(): void {
        this.newEmployee = {
            employeeCode: '', firstName: '', lastName: '', gender: '', dob: '',
            email: '', mobile: '', departmentId: 1, designationId: 1,
            managerId: undefined, dateOfJoining: '', employmentType: '',
            maritalStatus: '', bloodGroup: '', profilePhotoUrl: '', probationEndDate: ''
        };
    }

    createEmployee(): void {
        this.employeeService.createEmployee(this.newEmployee).subscribe({
            next: () => {
                this.toastr.success('Employee created successfully', 'Success');
                this.closeAddModal();
                this.loadEmployees();
            },
            error: () => this.toastr.error('Failed to create employee', 'Error')
        });
    }

    exitEmployee(employeeId: string): void {
        if (confirm('Are you sure you want to exit this employee?')) {
            this.employeeService.exitEmployee(employeeId).subscribe({
                next: () => {
                    this.toastr.success('Employee exited successfully', 'Success');
                    this.loadEmployees();
                },
                error: () => this.toastr.error('Failed to exit employee', 'Error')
            });
        }
    }

    getStatusClass(status: string): string {
        return status === 'ACTIVE' ? 'status-active' : 'status-exited';
    }

    applyFilter(): void {
        const list = this.employees();
        if (!this.searchTerm.trim()) {
            this.filteredEmployees.set(list);
            return;
        }

        const term = this.searchTerm.toLowerCase();
        const filtered = list.filter(e =>
            e.firstName.toLowerCase().includes(term) ||
            (e.lastName && e.lastName.toLowerCase().includes(term)) ||
            e.employeeCode.toLowerCase().includes(term) ||
            e.email.toLowerCase().includes(term)
        );
        this.filteredEmployees.set(filtered);
    }
}
