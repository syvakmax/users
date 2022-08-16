import { Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { StorageService } from "src/app/services/storage.service";
import { IUser } from "../users";

@Component({
  selector: "app-top-domains",
  templateUrl: "./top-domains.component.html",
  styleUrls: ["./top-domains.component.css"],
})
export class TopDomainsComponent implements OnInit {
  users$ = new Observable<IUser[]>();
  emails$ = new Observable<(string | number)[][]>();

  constructor(private storage: StorageService) {
    this.users$ = this.storage.items$;
  }

  ngOnInit(): void {
    this.emails$ = this.users$.pipe(
      map((users) => {
        return users.map((u) => u.email);
      }),
      map((emails) => {
        return emails.map((e) => e.match(/[^@]*$/)!.toString());
      }),
      map((domains) => {
        const count: Record<string, number> = {};
        let top = [];
        domains.forEach((domain) => {
          count[domain] = (count[domain] || 0) + 1;
        });
        for (const c in count) {
          top.push([c, count[c]]);
        }
        top.sort((a, b) => {
          return Number(b[1]) - Number(a[1]);
        });
        return top;
      })
    );
  }
}
