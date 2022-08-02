import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { users, IUser } from "../users";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-user-modal",
  templateUrl: "./add-user-modal.component.html",
  styleUrls: ["./add-user-modal.component.css"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddUserModalComponent implements OnInit, OnDestroy {
  @Output() newUser = new EventEmitter<IUser>();

  users = users;

  firstName = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
  ]);
  lastName = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
  ]);
  email = new FormControl("", [
    Validators.required,
    Validators.email,
    //Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
  ]);
  birthDate = new FormControl("", [Validators.required]);
  role = new FormControl("", [Validators.required]);

  addUserForm = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    birthDate: this.birthDate,
    role: this.role,
  });

  isValid = false;

  constructor(private db: AngularFirestore, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  inSubmission = false;
  showAlert = false;
  alertColor = "blue";
  alertMsg = "Adding a new user";
  closeDialog = false;

  async addNewUser() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = "blue";
    this.alertMsg = "Adding a new user";
    const timestamp = Date();
    const userID = Date.parse(timestamp);

    const newUser: IUser = {
      id: userID,
      firstName: this.firstName.value as string,
      lastName: this.lastName.value as string,
      email: this.email.value as string,
      birthDate: this.birthDate.value as string,
      role: this.role.value as string,
    };

    try {
      await this.db
        .collection("users")
        .doc(userID.toString())
        .set({
          ...newUser,
        });
    } catch (err) {
      this.inSubmission = false;
      this.alertColor = "red";
      this.alertMsg = "An unexpected error occured. Please try again later";
      console.error(err);
      return;
    }

    this.inSubmission = false;
    this.alertColor = "green";
    this.alertMsg = "Success! New user has been added";

    this.newUser.emit(newUser);

    // setTimeout(() => {
    //   this.modal.toggleModal("add-user");
    // }, 1000);
    // setTimeout(() => {
    //   this.router.navigate(["user", userID]);
    // }, 1200);
  }

  pushUsers() {
    this.users.forEach(async (user, i) => {
      try {
        const timestamp = Date();
        const userID = Date.parse(timestamp) + i;
        await this.db.collection("users").doc(userID.toString()).set({
          id: userID,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          birthDate: user.birthDate,
          role: user.role,
        });
      } catch (err) {
        this.alertColor = "red";
        this.alertMsg = "An unexpected error occured. Please try again later";
        console.error(err);
        return;
      }
      console.log("success " + i);
    });
  }
}
