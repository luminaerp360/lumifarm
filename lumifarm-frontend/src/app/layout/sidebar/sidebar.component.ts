import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { AuthService } from '../../shared/services/auth/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  superAdminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Input() mobileHidden = true;
  @Input() isMobile = false;
  @Output() toggle = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<void>();

  allNavItems: NavItem[] = [
    { label: 'Dashboard', icon: 'fas fa-th-large', route: '/dashboard' },
    { label: 'Properties', icon: 'fas fa-building', route: '/properties' },
    { label: 'Units', icon: 'fas fa-door-open', route: '/units' },
    { label: 'Tenants', icon: 'fas fa-users', route: '/tenants' },
    { label: 'Leases', icon: 'fas fa-file-contract', route: '/leases' },
    { label: 'Payments', icon: 'fas fa-money-bill-wave', route: '/payments' },
    { label: 'Damages', icon: 'fas fa-tools', route: '/damages' },
    { label: 'Reports', icon: 'fas fa-chart-bar', route: '/reports' },
    { label: 'Users', icon: 'fas fa-users-cog', route: '/users' },
    { label: 'Settings', icon: 'fas fa-cog', route: '/settings' },
    { label: 'Organizations', icon: 'fas fa-city', route: '/system-tenants', superAdminOnly: true },
  ];

  navItems: NavItem[] = [];
  private userSub?: Subscription;

  constructor(
    public router: Router,
    public themeService: ThemeService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user$.subscribe((user) => {
      const isSuperAdmin = user?.role === 'super_admin';
      this.navItems = this.allNavItems.filter((item) => !item.superAdminOnly || isSuperAdmin);
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
