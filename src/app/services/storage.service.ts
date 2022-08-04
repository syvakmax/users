import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IUser } from "../users/users";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private _itemsBehaviour = new BehaviorSubject<IUser[]>([]);

  get items$() {
    return this._itemsBehaviour.asObservable();
  }

  constructor() {}

  requestData(sort: string, page: number, loadLimit: number) {}
}
