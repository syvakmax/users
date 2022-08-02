import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { IUser } from "../users";

@Component({
  selector: "app-user-card",
  templateUrl: "./user-card.component.html",
  styleUrls: ["./user-card.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent implements OnInit {
  @Input() user: IUser = {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    role: "",
  };
  @Output() editUser = new EventEmitter();
  @Output() deleteUser: EventEmitter<IUser> = new EventEmitter();

  ngOnInit() {
    console.error("create user card");
  }
}
