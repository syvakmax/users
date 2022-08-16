import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { LoadAllUsers } from '../+state/user.actions';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  emails$: Observable<string[]>;

  constructor(private storage: StorageService, private store: Store) {
    this.emails$ = this.storage.items$.pipe(
      map((users) => users.map((user) => user.email))
    );
  }

  ngOnInit(): void {
    this.storage.loadAllUsers();

    this.store.dispatch(new LoadAllUsers());

    console.log('nav init');
  }
}
