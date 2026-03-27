import { Component } from "@angular/core";
import { ThemeService } from "../../shared/services/theme/theme.service";

@Component({
  selector: "app-harvest",
  templateUrl: "./harvest.component.html",
  styleUrls: ["./harvest.component.scss"],
})
export class HarvestComponent {
  constructor(public themeService: ThemeService) {}
}
