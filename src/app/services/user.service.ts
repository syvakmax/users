import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
} from "@angular/fire/compat/firestore";
import {
  Observable,
  map,
  BehaviorSubject,
  switchMap,
  combineLatest,
  from,
} from "rxjs";
import { users, IUser } from "../users/users";

@Injectable({
  providedIn: "root",
})
export class UserService {
  users: IUser[] = [];

  private usersCollection: AngularFirestoreCollection<IUser>;
  users$: Observable<IUser[]>;

  constructor(private readonly db: AngularFirestore) {
    this.usersCollection = db.collection<IUser>("users");
    this.users$ = this.usersCollection.valueChanges();
  }

  getAllUsers() {
    return this.users$;
  }

  getUsersSorted(
    sort$: BehaviorSubject<string>,
    numUsersLoaded$: BehaviorSubject<number>,
    loadLimit: number,
    lastUserId$: BehaviorSubject<number>
  ) {
    return combineLatest([sort$, numUsersLoaded$, lastUserId$]).pipe(
      switchMap((values) => {
        const [sort, numUsersLoaded, lastUserId] = values;

        // let query = this.usersCollection.ref.orderBy(
        //   'id', sort === '1' ? 'desc' : 'asc'
        // );

        // if (numUsersLoaded > loadLimit) {
        //   query = query.startAfter(lastUserId)
        // };

        // query = query.limit(loadLimit);

        // return query.get();

        // const query = this.usersCollection.ref.orderBy(
        //   'id', sort === '1' ? 'desc' : 'asc'
        // ).startAt(0).limit(loadLimit);
        // return query.get();

        if (numUsersLoaded <= loadLimit) {
          const query = this.usersCollection.ref
            .orderBy("id", sort === "1" ? "desc" : "asc")
            .limit(loadLimit);
          return query.get();
        } else {
          const query = this.usersCollection.ref
            .orderBy("id", sort === "1" ? "desc" : "asc")
            .startAfter(lastUserId)
            .limit(loadLimit);
          return query.get();
        }
      }),
      map((snapshot) => {
        return (snapshot as QuerySnapshot<IUser>).docs;
      })
    );
  }

  getUsersSorted2(
    sort$: BehaviorSubject<string>,
    page$: BehaviorSubject<number>,
    prevLastUserId$: BehaviorSubject<number>,
    loadLimit: number
  ) {
    return combineLatest([sort$, page$, prevLastUserId$]).pipe(
      switchMap((values) => {
        const [sort, page, prevLastUserId] = values;
        if (page === 1) {
          const query = this.usersCollection.ref
            .orderBy("id", sort === "1" ? "desc" : "asc")
            .limit(loadLimit);
          return query.get();
        } else {
          const query = this.usersCollection.ref
            .where("id", "<", prevLastUserId)
            .orderBy("id", sort === "1" ? "desc" : "asc")
            .limit(loadLimit);
          return query.get();
        }
      }),
      map((snapshot) => {
        return (snapshot as QuerySnapshot<IUser>).docs;
      }),
      map((docs) => {
        let users: IUser[] = [];
        docs.forEach((doc) => users.push(doc.data()));
        return users;
      })
    );
  }

  getUsersSorted3(
    sort$: BehaviorSubject<string>,
    page$: BehaviorSubject<number>,
    prevLastUserId$: BehaviorSubject<number>,
    loadLimit: number
  ) {
    return combineLatest([sort$, page$, prevLastUserId$]).pipe(
      switchMap((values) => {
        const [sort, page, prevLastUserId] = values;
        if (page === 1) {
          const query = this.usersCollection.ref
            .orderBy("id", sort === "1" ? "desc" : "asc")
            .limit(loadLimit);
          console.log("first");
          return query.get();
        } else {
          const query = this.usersCollection.ref
            .where("id", sort === "1" ? "<" : ">", prevLastUserId)
            .orderBy("id", sort === "1" ? "desc" : "asc")
            .limit(loadLimit);
          console.log("second");
          return query.get();
        }
      }),
      map((snapshot) => {
        return (snapshot as QuerySnapshot<IUser>).docs;
      })
    );
  }

  getUsers(
    sort$: BehaviorSubject<string>,
    page$: BehaviorSubject<number>,
    loadLimit: number
  ) {
    return combineLatest([sort$, page$]).pipe(
      switchMap((values) => {
        const [sort, page] = values;
        const query = this.usersCollection.ref
          .orderBy("id", sort === "1" ? "desc" : "asc")
          .limit(page * loadLimit);
        return query.get();
      }),
      map((snap) => {
        return (snap as QuerySnapshot<IUser>).docs;
      }),
      map((docs) => {
        let users: IUser[] = [];
        docs.forEach((doc) => users.push(doc.data()));
        return users.slice(-loadLimit);
      })
    );
  }

  getUsers2(sort: string, page: number, loadLimit: number) {
    const query = this.usersCollection.ref
      .orderBy("id", sort === "1" ? "desc" : "asc")
      .limit(page * loadLimit);
    const res = from(query.get()).pipe(
      map((snap) => {
        return (snap as QuerySnapshot<IUser>).docs;
      }),
      map((docs) => {
        let users: IUser[] = [];
        docs.forEach((doc) => users.push(doc.data()));
        return users.slice(-loadLimit);
      })
    );
    return res;
  }

  getUserById(id: string) {
    return this.usersCollection
      .doc(id)
      .snapshotChanges()
      .pipe(map((snapshot) => snapshot.payload.data()));
  }

  async getLastUserId() {
    const query = this.usersCollection.ref.orderBy("id", "desc").limit(1);
    const querySnapshot = await query.get();
    let id;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      id = doc.data().id;
    });
    return id;
  }

  updateUser(id: string, updatedUser: IUser) {
    return this.usersCollection.doc(id).update({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      birthDate: updatedUser.birthDate,
      role: updatedUser.role,
    });
  }

  async deleteUser(user: IUser) {
    await this.usersCollection.doc(user.id.toString()).delete();
  }
}
