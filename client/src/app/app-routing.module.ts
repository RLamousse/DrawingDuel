import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameListComponent } from "./game-list/game-list.component";
import { InitialViewComponent } from "./initial-view/initial-view.component";
import { PlayViewComponent } from "./play-view/play-view.component";
import {SceneCreatorComponent} from "./scene-creator/scene-creator.component";
import { VueAdminComponent } from "./vue-admin/vue-admin.component";

const routes: Routes = [
    {path: "", component: InitialViewComponent},
    {path: "game-list", component: GameListComponent},
    {path: "admin", component: VueAdminComponent},
    {path: "play-view", component: PlayViewComponent},
    {path: "3d-view", component : SceneCreatorComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule { }
export const routingComponents: (typeof InitialViewComponent | typeof GameListComponent)[] = [];
