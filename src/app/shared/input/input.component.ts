import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"],
})
export class InputComponent {
  @Input() control = new FormControl();
  @Input() type = "text";
  @Input() name = "";
  @Input() placeholder = "";
  @Input() label = "";

  constructor() {}
}
