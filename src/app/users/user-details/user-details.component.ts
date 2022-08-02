import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params } from "@angular/router";
import { Router } from "@angular/router";
import { Observable, switchMap } from "rxjs";
import { ModalService } from "src/app/services/modal.service";
import { UserService } from "src/app/services/user.service";
import { DeleteUserModalComponent } from "../delete-user-modal/delete-user-modal.component";
import { EditUserModalComponent } from "../edit-user-modal/edit-user-modal.component";
import { IUser } from "../users";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit {
  user$ = new Observable<IUser | undefined>(undefined);

  editUser?: IUser;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private modal: ModalService,
    private router: Router,
    public dialog: MatDialog //private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // const routeParams = this.route.snapshot.paramMap;
    // const userIdFromRoute = routeParams.get("id");

    // if (userIdFromRoute) {
    //   let newUser;
    //   this.userService.getUserById(userIdFromRoute).subscribe((user) => {
    //     this.user$.next(user);
    //     // this.cd.markForCheck();
    //   });
    // }

    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const selectedId = params.get("id");
        return this.userService.getUserById(selectedId!);
      })
    );
  }

  openDialogEdit(user: IUser) {
    let dialogRef = this.dialog.open(EditUserModalComponent, {
      data: user,
    });

    const sub = dialogRef.componentInstance.updatedUser.subscribe((user) => {
      setTimeout(() => {
        dialogRef.close();
      }, 1000);
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  openDialogDelete(user: IUser) {
    let dialogRef = this.dialog.open(DeleteUserModalComponent);

    const sub = dialogRef.componentInstance.deleteUser.subscribe(() => {
      this.deleteUser(user);
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  async deleteUser(user: IUser) {
    await this.userService.deleteUser(user);
    this.router.navigateByUrl("");
  }
}
