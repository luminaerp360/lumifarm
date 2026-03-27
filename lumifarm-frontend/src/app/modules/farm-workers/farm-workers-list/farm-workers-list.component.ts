import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FarmWorkersService } from "../../../shared/services/farm-workers/farm-workers.service";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";

@Component({
  selector: "app-farm-workers-list",
  templateUrl: "./farm-workers-list.component.html",
  styleUrls: ["./farm-workers-list.component.scss"],
})
export class FarmWorkersListComponent implements OnInit {
  workers: any[] = [];
  loading = true;
  search = "";
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;
  showForm = false;
  editingWorker: any = null;
  saving = false;

  roleOptions = ["owner", "manager", "worker", "specialist", "contractor"];
  availabilityOptions = ["full_time", "part_time", "seasonal"];

  form: any = {
    fullName: "",
    phone: "",
    email: "",
    nationalId: "",
    role: "worker",
    availability: "full_time",
    monthlyWage: 0,
    address: "",
    skills: "",
  };

  constructor(
    private workersService: FarmWorkersService,
    private authService: AuthService,
    public themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadWorkers();
  }

  loadWorkers(): void {
    this.loading = true;
    this.workersService
      .getAll(this.page, this.limit, this.search || undefined)
      .subscribe({
        next: (res) => {
          this.workers = res.data;
          this.total = res.total;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSearch(): void {
    this.page = 1;
    this.loadWorkers();
  }
  goToPage(p: number): void {
    this.page = p;
    this.loadWorkers();
  }

  openForm(worker?: any): void {
    this.editingWorker = worker || null;
    this.form = worker
      ? { ...worker }
      : {
          fullName: "",
          phone: "",
          email: "",
          nationalId: "",
          role: "worker",
          availability: "full_time",
          monthlyWage: 0,
          address: "",
          skills: "",
        };
    this.showForm = true;
  }

  save(): void {
    if (!this.form.fullName || !this.form.phone) return;
    this.saving = true;
    const tenantId = this.authService.getActiveTenantId();
    const payload = {
      tenantId,
      fullName: this.form.fullName,
      phone: this.form.phone,
      email: this.form.email || "",
      nationalId: this.form.nationalId || "",
      role: this.form.role || "worker",
      availability: this.form.availability || "full_time",
      monthlyWage: Number(this.form.monthlyWage || 0),
      address: this.form.address || "",
      skills: this.form.skills || "",
      joinDate: this.form.joinDate || new Date(),
      isActive: true,
    };
    const obs = this.editingWorker
      ? this.workersService.update(this.editingWorker._id, payload)
      : this.workersService.create(payload);
    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.loadWorkers();
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  viewWorker(id: string): void {
    this.router.navigate(["/farm-workers", id]);
  }
}
