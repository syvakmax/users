import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import {
  BehaviorSubject,
  map,
  Observable,
  Subscription,
  switchMap,
  tap,
} from "rxjs";
import { UserService } from "src/app/services/user.service";
import { MatDialog } from "@angular/material/dialog";
import { IUser } from "../users";
import { DeleteUserModalComponent } from "../delete-user-modal/delete-user-modal.component";
import { AddUserModalComponent } from "../add-user-modal/add-user-modal.component";
import { EditUserModalComponent } from "../edit-user-modal/edit-user-modal.component";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit, OnDestroy {
  users$: Observable<IUser[]>;
  usersOrder = "1";
  pageCounter = 1;
  loadLimit = 9;
  sub$!: Subscription;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private storage: StorageService
  ) {
    this.users$ = new Observable<IUser[]>();
  }

  ngOnInit(): void {
    //this.users$ = this.storage.items$;
    this.users$ = this.storage.itemsList$;

    this.sub$ = this.route.queryParams
      .pipe(
        tap((params) => {
          this.usersOrder = params.sort === "2" ? "2" : "1";
          this.pageCounter = Number(params.page ? params.page : 1);
          this.storage.setSort(this.usersOrder);
          this.storage.setPage(this.pageCounter);
          // this.storage.requestData(this.loadLimit);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  sort($event: Event) {
    const { value } = $event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
        page: 1,
      },
    });
  }

  nextPage() {
    this.pageCounter += 1;
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
    //this.storage.requestData(this.loadLimit);
  }

  addUser() {
    if (this.pageCounter === 1) {
      // this.storage.requestData(this.loadLimit);
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          sort: this.usersOrder,
          page: 1,
        },
      });
    }
  }

  updateUser(user: IUser) {
    // this.storage.requestData(this.loadLimit);
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
      //debugger;
      if (shouldDelete) {
        this.deleteUser(user);
      }
    });
  }

  openDialogAdd() {
    let dialogRef = this.dialog.open(AddUserModalComponent);

    dialogRef.afterClosed().subscribe((userAdded) => {
      if (userAdded) {
        this.addUser();
      }
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
