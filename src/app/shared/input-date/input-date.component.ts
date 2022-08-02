import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-input-date",
  templateUrl: "./input-date.component.html",
  styleUrls: ["./input-date.component.css"],
})
export class InputDateComponent {
  @Input() control = new FormControl();
  @Input() name = "";
  @Input() label = "";
  @Input() value = "";

  constructor() {}
}
