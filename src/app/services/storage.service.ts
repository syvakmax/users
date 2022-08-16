import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map, switchMap } from "rxjs";
import { IUser } from "../users/users";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private _itemsBehaviour = new BehaviorSubject<IUser[]>([]);

  private _sort = new BehaviorSubject("1");
  private _page = new BehaviorSubject(1);
  private _limit = 3;

  get items$() {
    return this._itemsBehaviour.asObservable();
  }

  get itemsList$() {
    return combineLatest([this._sort, this._page]).pipe(
      switchMap((values) => {
        const [sort, page] = values;
        return this._itemsBehaviour.pipe(
          map((u) => {
            return u.sort((a, b) => {
              if (sort === "1") {
                return b.id - a.id;
              } else {
                return a.id - b.id;
              }
            });
          }),
          map((u) => {
            return u.slice(
              page * this._limit - this._limit,
              page * this._limit
            );
          })
        );
      })
    );
  }

  constructor(private userService: UserService) {}

  requestData(sort: string, page: number, loadLimit: number) {
    this.userService.getUsers(sort, page, loadLimit).subscribe((users) => {
      this._itemsBehaviour.next(users);
    });
  }

  loadAllUsers() {
    this.userService.getAllUsers().subscribe((users) => {
      this._itemsBehaviour.next(users);
    });
  }

  setSort(sort: string) {
    this._sort.next(sort);
  }

  setPage(page: number) {
    this._page.next(page);
  }
}
