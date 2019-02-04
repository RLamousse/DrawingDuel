import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameListComponent } from "./game-list/game-list.component";
import { VueAdminComponent } from "./vue-admin/vue-admin.component";
import { InitialViewComponent } from "./initial-view/initial-view.component";

const routes: Routes = [
    {path: "", component: InitialViewComponent},
    {path: "game-list", component: GameListComponent},
    {path: "admin", component: VueAdminComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule { }
export const routingComponents: (typeof InitialViewComponent | typeof GameListComponent)[] = [];
