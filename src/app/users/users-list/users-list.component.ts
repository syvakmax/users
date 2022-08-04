import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
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

  users2$: Observable<IUser[]>;
  page$: BehaviorSubject<number>;
  pageCounter = 1;

  users: IUser[] = [];
  loadLimit = 3;
  numUsersLoaded = this.loadLimit;
  usersOrder = "1";

  sort$: BehaviorSubject<string>;
  numUsersLoaded$: BehaviorSubject<number>;
  lastUserId$: BehaviorSubject<number>;

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
    this.users2$ = new Observable<IUser[]>();
    this.page$ = new BehaviorSubject(this.pageCounter);
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

    // this.userService
    //   .getUsersSorted(
    //     this.sort$,
    //     this.numUsersLoaded$,
    //     this.loadLimit,
    //     this.lastUserId$
    //   )
    //   .subscribe((docs) => {
    //     docs.forEach((doc) => {
    //       this.users.push(doc.data());
    //       this.users$.next(this.users);
    //     });
    //   });

    // this.users2$ = this.userService.getUsers(
    //   this.sort$,
    //   this.page$,
    //   this.loadLimit
    // );

    this.users2$ = this.route.queryParams.pipe(
      switchMap((params) => {
        this.usersOrder = params.sort === "2" ? "2" : "1";
        this.pageCounter = Number(params.page);
        return this.userService.getUsers2(
          this.usersOrder,
          this.pageCounter,
          this.loadLimit
        );
      })
    );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.usersOrder,
        page: this.pageCounter,
      },
    });
  }

  // onScroll() {
  //   this.lastUserId$.next(this.users[this.numUsersLoaded - 1].id);
  //   this.numUsersLoaded += 6;
  //   this.numUsersLoaded$.next(this.numUsersLoaded);
  // }

  // loadMore() {
  //   this.lastUserId$.next(this.users[this.numUsersLoaded - 1].id);
  //   this.numUsersLoaded += 6;
  //   this.numUsersLoaded$.next(this.numUsersLoaded);
  // }

  sort($event: Event) {
    this.users = [];
    this.users$.next(this.users);
    const { value } = $event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
        page: 1,
      },
    });
    this.numUsersLoaded = this.loadLimit;
    this.numUsersLoaded$.next(this.numUsersLoaded);
    this.lastUserId$.next(0);
  }

  nextPage() {
    this.pageCounter += 1;
    this.page$.next(this.pageCounter);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.usersOrder,
        page: this.pageCounter,
      },
    });
  }

  prevPage() {
    this.pageCounter -= 1;
    this.page$.next(this.pageCounter);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.usersOrder,
        page: this.pageCounter,
      },
    });
  }

  async deleteUser(user: IUser) {
    await this.userService.deleteUser(user);
    this.page$.next(this.pageCounter);

    // this.users.forEach((u, i) => {
    //   if (u.id === user.id) {
    //     this.users.splice(i, 1);
    //     this.numUsersLoaded -= 1;
    //   }
    // });
    // this.users$.next(this.users);
  }

  addUser(user: IUser) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.usersOrder,
        page: 1,
      },
    });
    this.page$.next(this.pageCounter);
    // if (this.usersOrder === "1") {
    //   this.users.unshift(user);
    //   this.numUsersLoaded += 1;
    //   this.users$.next(this.users);
    // }
  }

  updateUser(user: IUser) {
    this.page$.next(this.pageCounter);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.usersOrder,
        page: this.pageCounter,
      },
    });
    // const oldUser = this.users.find((u) => u.id === user.id);

    // if (oldUser) {
    //   const oldUserIndex = this.users.indexOf(oldUser);
    //   this.users[oldUserIndex] = user;
    //   this.users$.next(this.users);
    // }
  }

  trackByFn(index: number, item: IUser) {
    return item.id;
  }

  openDialogDelete(user: IUser) {
    let dialogRef = this.dialog.open(DeleteUserModalComponent);

    // const sub = dialogRef.componentInstance.deleteUser.subscribe(() => {
    //   this.deleteUser(user);
    // });

    dialogRef.afterClosed().subscribe((shouldDelete) => {
      debugger;
      if (shouldDelete) {
        this.deleteUser(user);
      }
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
