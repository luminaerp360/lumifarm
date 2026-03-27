import { Component } from "@angular/core";
import { ThemeService } from "../../shared/services/theme/theme.service";

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
})
export class InventoryComponent {
  constructor(public themeService: ThemeService) {}
}
