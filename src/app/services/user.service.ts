import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Observable, map, BehaviorSubject, switchMap, combineLatest } from 'rxjs';
import { users, IUser } from '../users/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: IUser[] = []

  private usersCollection: AngularFirestoreCollection<IUser>
  users$: Observable<IUser[]>

  constructor(
    private readonly db: AngularFirestore
  ) {
    this.usersCollection = db.collection<IUser>('users');
    this.users$ = this.usersCollection.valueChanges();
  }

  getUsers() {
    return this.users$
  }

  getUsersSorted(sort$: BehaviorSubject<string>, numUsersLoaded$: BehaviorSubject<number>) {
    return combineLatest([
      sort$,
      numUsersLoaded$
    ]).pipe(
      switchMap(values => {
        const [sort, numUsersLoaded] = values
        const query = this.usersCollection.ref.orderBy(
          'id', sort === '1' ? 'desc' : 'asc'
        ).limit(numUsersLoaded)
        return query.get()
      }),
      map(snapshot => {
        return (snapshot as QuerySnapshot<IUser>).docs
      })
    )
  }

  getUsersSorted2(sort$: BehaviorSubject<string>, numUsersLoaded$: BehaviorSubject<number>, loadLimit: number, lastUserId$: BehaviorSubject<number>) {
    return combineLatest([
      sort$,
      numUsersLoaded$,
      lastUserId$
    ]).pipe(
      switchMap(values => {
        const [sort, numUsersLoaded, lastUserId] = values
        if (numUsersLoaded <= loadLimit) {
          const query = this.usersCollection.ref.orderBy(
            'id', sort === '1' ? 'desc' : 'asc'
          ).limit(numUsersLoaded)
          console.log('1 cond')
          return query.get()
        } else {
          const query = this.usersCollection.ref.orderBy(
            'id', sort === '1' ? 'desc' : 'asc'
          ).startAfter(lastUserId).limit(loadLimit)
          console.log('2 cond')
          return query.get()
        }
      }),
      map(snapshot => {
        console.log((snapshot as QuerySnapshot<IUser>).docs)
        return (snapshot as QuerySnapshot<IUser>).docs
      })
    )
  }

  getUserById(id: string) {
    return this.usersCollection.doc(id).snapshotChanges().pipe(
      map(snapshot => snapshot.payload.data())
    )
  }

  updateUser(id: string, updatedUser: IUser) {
    return this.usersCollection.doc(id).update({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      birthDate: updatedUser.birthDate,
      role: updatedUser.role
    })
  }

  async deleteUser(user: IUser) {
    await this.usersCollection.doc(user.id.toString()).delete()
  }

}
