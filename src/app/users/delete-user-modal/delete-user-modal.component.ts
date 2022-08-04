import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-delete-user-modal",
  templateUrl: "./delete-user-modal.component.html",
  styleUrls: ["./delete-user-modal.component.css"],
})
export class DeleteUserModalComponent implements OnInit {
  @Output() deleteUser = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<DeleteUserModalComponent>) {}

  ngOnInit(): void {}

  closeDialog(shouldDelete: boolean) {
    this.dialogRef.close(shouldDelete);
  }
}
