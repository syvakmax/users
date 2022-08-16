import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { UsersModule } from "./users/users.module";
import { SharedModule } from "./shared/shared.module";
import { HomeComponent } from "./home/home.component";
import { NavComponent } from "./nav/nav.component";
import { NotFoundComponent } from "./not-found/not-found.component";

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { environment } from "src/environments/environment";

@NgModule({
  declarations: [AppComponent, HomeComponent, NavComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    UsersModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
