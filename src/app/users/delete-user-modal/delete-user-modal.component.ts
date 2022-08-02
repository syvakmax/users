import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-delete-user-modal",
  templateUrl: "./delete-user-modal.component.html",
  styleUrls: ["./delete-user-modal.component.css"],
})
export class DeleteUserModalComponent implements OnInit {
  @Output() deleteUser = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
