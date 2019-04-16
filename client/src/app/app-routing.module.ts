import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
  ADMIN_ROUTE,
  GAMES_ROUTE,
  HOME_ROUTE,
  LOADING_ROUTE,
  PLAY_3D_ROUTE,
  PLAY_ROUTE
} from "../../../common/communication/routes";
import { AwaitViewComponent} from "./await-view/await-view.component";
import { GameListComponent } from "./game-list/game-list.component";
import { InitialViewComponent } from "./initial-view/initial-view.component";
import { PlayViewComponent } from "./play-view/play-view.component";
import { SceneCreatorComponent } from "./scene-creator/scene-creator.component";
import { VueAdminComponent } from "./vue-admin/vue-admin.component";

const routes: Routes = [
    { path: HOME_ROUTE, component: InitialViewComponent },
    { path: GAMES_ROUTE, component: GameListComponent },
    { path: ADMIN_ROUTE , component: VueAdminComponent },
    { path: PLAY_ROUTE , component: PlayViewComponent },
    { path: PLAY_3D_ROUTE , component: SceneCreatorComponent },
    { path: LOADING_ROUTE , component: AwaitViewComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule { }
export const routingComponents: (typeof InitialViewComponent | typeof GameListComponent)[] = [];
