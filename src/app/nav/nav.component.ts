import { Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { StorageService } from "../services/storage.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  emails$: Observable<string[]>;

  constructor(private storage: StorageService) {
    this.emails$ = this.storage.items$.pipe(
      map((users) => users.map((user) => user.email))
    );
  }

  ngOnInit(): void {
    this.storage.loadAllUsers();
    console.log("nav init");
  }
}
