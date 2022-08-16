import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { TopDomainsComponent } from "./users/top-domains/top-domains.component";
import { UserDetailsComponent } from "./users/user-details/user-details.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "users",
    pathMatch: "full",
  },
  {
    path: "users",
    component: HomeComponent,
  },
  {
    path: "user/:id",
    component: UserDetailsComponent,
  },
  {
    path: "top-domains",
    component: TopDomainsComponent,
  },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
