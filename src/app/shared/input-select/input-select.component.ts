import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-input-select",
  templateUrl: "./input-select.component.html",
  styleUrls: ["./input-select.component.css"],
})
export class InputSelectComponent {
  @Input() control = new FormControl();
  @Input() options: string[] = [];

  constructor() {}
}
