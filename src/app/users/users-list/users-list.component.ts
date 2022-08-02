import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { UserService } from "src/app/services/user.service";
import { MatDialog } from "@angular/material/dialog";
import { IUser } from "../users";
import { DeleteUserModalComponent } from "../delete-user-modal/delete-user-modal.component";
import { AddUserModalComponent } from "../add-user-modal/add-user-modal.component";
import { EditUserModalComponent } from "../edit-user-modal/edit-user-modal.component";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  users$: BehaviorSubject<IUser[]>;

  users: IUser[] = [];
  loadLimit = 12;
  numUsersLoaded = this.loadLimit;
  usersOrder = "1";
  activeUser: IUser | null = null;

  sort$: BehaviorSubject<string>;
  numUsersLoaded$: BehaviorSubject<number>;
  lastUserId$: BehaviorSubject<number>;

  activeModal = "";

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.sort$ = new BehaviorSubject(this.usersOrder);
    this.numUsersLoaded$ = new BehaviorSubject(this.loadLimit);
    this.lastUserId$ = new BehaviorSubject(0);
    this.users$ = new BehaviorSubject<IUser[]>([]);
  }

  ngOnInit(): void {
    /*this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
        console.log(this.users)
      }
    })
    //Works with the following condition:
    //let user of users | slice:0:numUsersLoaded
    
    this.userService.getUsersSorted(this.sort$, this.numUsersLoaded$).subscribe(docs => {
      this.users = []

      docs.forEach(doc => {
        this.users.push(doc.data())
      })
    })
    */

    this.userService
      .getUsersSorted(
        this.sort$,
        this.numUsersLoaded$,
        this.loadLimit,
        this.lastUserId$
      )
      .subscribe((docs) => {
        docs.forEach((doc) => {
          this.users.push(doc.data());
          this.users$.next(this.users);
        });
      });

    this.route.queryParams.subscribe((params: Params) => {
      this.usersOrder = params.sort === "2" ? "2" : "1";
      this.sort$.next(this.usersOrder);
    });
  }

  onScroll() {
    this.lastUserId$.next(this.users[this.numUsersLoaded - 1].id);
    this.numUsersLoaded += 6;
    this.numUsersLoaded$.next(this.numUsersLoaded);
  }

  loadMore() {
    this.lastUserId$.next(this.users[this.numUsersLoaded - 1].id);
    this.numUsersLoaded += 6;
    this.numUsersLoaded$.next(this.numUsersLoaded);
  }

  sort($event: Event) {
    this.users = [];
    this.users$.next(this.users);
    const { value } = $event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
    this.numUsersLoaded = this.loadLimit;
    this.numUsersLoaded$.next(this.numUsersLoaded);
    this.lastUserId$.next(0);
  }

  deleteUser(user: IUser) {
    this.userService.deleteUser(user);

    this.users.forEach((u, i) => {
      if (u.id === user.id) {
        this.users.splice(i, 1);
        this.numUsersLoaded -= 1;
      }
    });
    this.users$.next(this.users);
  }

  addUser(user: IUser) {
    if (this.usersOrder === "1") {
      this.users.unshift(user);
      this.numUsersLoaded += 1;
    }
    this.users$.next(this.users);
  }

  updateUser(user: IUser) {
    const oldUser = this.users.find((u) => u.id === user.id);

    if (oldUser) {
      const oldUserIndex = this.users.indexOf(oldUser);
      this.users[oldUserIndex] = user;
      this.users$.next(this.users);
    }
  }

  trackByFn(index: number, item: IUser) {
    return item.id;
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

  openDialogAdd() {
    let dialogRef = this.dialog.open(AddUserModalComponent);

    const sub = dialogRef.componentInstance.newUser.subscribe((user) => {
      this.addUser(user);
      setTimeout(() => {
        dialogRef.close();
      }, 1000);
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  openDialogEdit(user: IUser) {
    let dialogRef = this.dialog.open(EditUserModalComponent, {
      data: user,
    });

    const sub = dialogRef.componentInstance.updatedUser.subscribe((user) => {
      this.updateUser(user);
      setTimeout(() => {
        dialogRef.close();
      }, 1000);
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
