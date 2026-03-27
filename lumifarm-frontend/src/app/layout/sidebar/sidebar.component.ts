import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ThemeService } from "../../shared/services/theme/theme.service";
import { AuthService } from "../../shared/services/auth/auth.service";

interface NavItem {
  label: string;
  icon: string;
  route: string;
  superAdminOnly?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Input() mobileHidden = true;
  @Input() isMobile = false;
  @Output() toggle = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<void>();

  allNavGroups: NavGroup[] = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: "fas fa-th-large", route: "/dashboard" },
      ],
    },
    {
      title: "Farm Operations",
      items: [
        { label: "Farms", icon: "fas fa-tractor", route: "/farms" },
        { label: "Plots / Fields", icon: "fas fa-border-all", route: "/plots" },
        {
          label: "Crop Cycles",
          icon: "fas fa-sync-alt",
          route: "/crop-cycles",
        },
        { label: "Tasks", icon: "fas fa-tasks", route: "/tasks" },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          label: "Farm Workers",
          icon: "fas fa-hard-hat",
          route: "/farm-workers",
        },
        {
          label: "Inventory & Inputs",
          icon: "fas fa-warehouse",
          route: "/inventory",
        },
        { label: "Equipment", icon: "fas fa-cogs", route: "/equipment" },
      ],
    },
    {
      title: "Monitoring",
      items: [
        {
          label: "Crop Issues",
          icon: "fas fa-exclamation-triangle",
          route: "/crop-issues",
        },
        {
          label: "Harvest & Yield",
          icon: "fas fa-wheat-awn",
          route: "/harvest",
        },
      ],
    },
    {
      title: "Finance & Reports",
      items: [
        { label: "Farm Finance", icon: "fas fa-coins", route: "/farm-finance" },
        { label: "Reports", icon: "fas fa-chart-pie", route: "/reports" },
      ],
    },
    {
      title: "Administration",
      items: [
        { label: "Users", icon: "fas fa-user-shield", route: "/users" },
        { label: "Settings", icon: "fas fa-sliders-h", route: "/settings" },
        {
          label: "Organizations",
          icon: "fas fa-sitemap",
          route: "/system-tenants",
          superAdminOnly: true,
        },
      ],
    },
  ];

  navGroups: NavGroup[] = [];
  private userSub?: Subscription;

  constructor(
    public router: Router,
    public themeService: ThemeService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user$.subscribe((user) => {
      const isSuperAdmin = user?.role === "super_admin";
      this.navGroups = this.allNavGroups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) => !item.superAdminOnly || isSuperAdmin,
          ),
        }))
        .filter((group) => group.items.length > 0);
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
