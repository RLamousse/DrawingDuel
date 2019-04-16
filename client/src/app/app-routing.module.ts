import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AwaitViewComponent} from "./await-view/await-view.component";
import { GameListComponent } from "./game-list/game-list.component";
import { InitialViewComponent } from "./initial-view/initial-view.component";
import { PlayViewComponent } from "./play-view/play-view.component";
import { SceneCreatorComponent } from "./scene-creator/scene-creator.component";
import {UNListService} from "./username.service";
import { VueAdminComponent } from "./vue-admin/vue-admin.component";

const routes: Routes = [
    { path: "", component: InitialViewComponent },
    { path: "game-list", component: GameListComponent, canActivate: [UNListService] },
    { path: "admin", component: VueAdminComponent },
    { path: "play-view", component: PlayViewComponent, canActivate: [UNListService] },
    { path: "3d-view", component: SceneCreatorComponent, canActivate: [UNListService] },
    { path: "await-view", component: AwaitViewComponent, canActivate: [UNListService]},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule { }
export const routingComponents: (typeof InitialViewComponent | typeof GameListComponent)[] = [];
