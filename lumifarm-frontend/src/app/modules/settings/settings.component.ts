import { Component } from '@angular/core';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  presetColors = [
    '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  ];

  constructor(
    public themeService: ThemeService,
    public authService: AuthService,
  ) {}

  get user() { return this.authService.getUser(); }

  get activeTenant() {
    const activeTenantId = this.authService.getActiveTenantId();
    return this.authService.getTenants().find((tenant) => tenant._id === activeTenantId) || null;
  }

  get tenantCount(): number {
    return this.authService.getTenants().length;
  }

  toggleDarkMode(): void { this.themeService.toggleTheme(); }

  setAccentColor(color: string): void { this.themeService.setAccentColor(color); }
}
