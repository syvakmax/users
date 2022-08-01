import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

import { IUser } from '../users';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: IUser[] = []
  loadLimit = 12
  numUsersLoaded = this.loadLimit
  usersOrder = '1'
  activeUser: IUser | null = null
  
  sort$: BehaviorSubject<string>
  numUsersLoaded$: BehaviorSubject<number>
  lastUserId$: BehaviorSubject<number>

  constructor(
    private modal: ModalService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sort$ = new BehaviorSubject(this.usersOrder)
    this.numUsersLoaded$ = new BehaviorSubject(this.loadLimit)
    this.lastUserId$ = new BehaviorSubject(0)
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

    this.userService.getUsersSorted(
      this.sort$, this.numUsersLoaded$,
      this.loadLimit, this.lastUserId$
    ).subscribe(docs => {
      docs.forEach(doc => {
        this.users.push(doc.data())
      })
    })

    this.route.queryParams.subscribe((params: Params) => {
      this.usersOrder = params.sort === '2' ? '2' : '1'
      this.sort$.next(this.usersOrder)
    })
  }

  addUserModal($event: Event) {
    $event.preventDefault()

    this.modal.toggleModal('add-user')
  }

  editUserModal($event: Event, user: IUser) {
    $event.preventDefault()
    this.activeUser = user
    this.modal.toggleModal('edit-user')
  }

  deleteUser($event: Event, user: IUser) {
    $event.preventDefault()

    this.userService.deleteUser(user)

    this.users.forEach((u, i) => {
      if (u.id === user.id) {
        this.users.splice(i, 1)
        this.numUsersLoaded -= 1
      }
    })
  }

  onScroll() {
    this.lastUserId$.next(this.users[this.numUsersLoaded - 1].id)
    this.numUsersLoaded += 6
    this.numUsersLoaded$.next(this.numUsersLoaded)
  }

  loadMore() {
    this.lastUserId$.next(this.users[this.numUsersLoaded - 1].id)
    this.numUsersLoaded += 6
    this.numUsersLoaded$.next(this.numUsersLoaded)
  }

  sort($event: Event) {
    this.users = []
    const { value } = $event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    })
    this.numUsersLoaded = this.loadLimit
    this.numUsersLoaded$.next(this.numUsersLoaded)
    this.lastUserId$.next(0)
  }

  updateUser($user: IUser) {
    this.users.filter(user => {
      user.id !== $user.id
    })
  }

}
