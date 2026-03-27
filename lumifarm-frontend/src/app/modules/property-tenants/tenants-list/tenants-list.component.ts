import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyTenantsService } from '../../../shared/services/property-tenants/property-tenants.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';
import { PropertyTenant } from '../../../shared/interfaces/models';

@Component({
  selector: 'app-tenants-list',
  templateUrl: './tenants-list.component.html',
  styleUrls: ['./tenants-list.component.scss'],
})
export class TenantsListComponent implements OnInit {
  tenants: PropertyTenant[] = [];
  loading = true;
  search = '';
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;
  showForm = false;
  editingTenant: PropertyTenant | null = null;
  saving = false;
  form: Partial<PropertyTenant> = { name: '', email: '', phone: '', idNumber: '', kraPin: '', occupation: '', employer: '' };

  constructor(
    private tenantsService: PropertyTenantsService,
    public themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void { this.loadTenants(); }

  loadTenants(): void {
    this.loading = true;
    this.tenantsService.getAll(this.page, this.limit, this.search || undefined).subscribe({
      next: (res) => { this.tenants = res.data; this.total = res.total; this.totalPages = res.totalPages; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onSearch(): void { this.page = 1; this.loadTenants(); }
  goToPage(p: number): void { this.page = p; this.loadTenants(); }

  openForm(tenant?: PropertyTenant): void {
    this.editingTenant = tenant || null;
    this.form = tenant ? { ...tenant } : { name: '', email: '', phone: '', idNumber: '', kraPin: '', occupation: '', employer: '' };
    this.showForm = true;
  }

  save(): void {
    if (!this.form.name) return;
    this.saving = true;
    const obs = this.editingTenant
      ? this.tenantsService.update(this.editingTenant._id, this.form)
      : this.tenantsService.create(this.form);
    obs.subscribe({
      next: () => { this.saving = false; this.showForm = false; this.loadTenants(); },
      error: () => { this.saving = false; },
    });
  }

  viewTenant(id: string): void { this.router.navigate(['/tenants', id]); }
}
