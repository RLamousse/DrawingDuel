import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameListComponent } from "./game-list/game-list.component";
import { VueComponent } from "./vue/vue.component";
import { VueAdminComponent } from "./vue-admin/vue-admin.component";

const routes: Routes = [
    {path: "initial-view", component: VueComponent},
    {path: "game-list", component: GameListComponent},
    {path: "admin", component: VueAdminComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule { }
export const routingComponents = [VueComponent, GameListComponent];
