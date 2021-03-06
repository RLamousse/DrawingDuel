import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule, MatSelectModule, MatSliderModule
} from "@angular/material";
import {MatDialogModule} from "@angular/material/dialog";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MaterialFileInputModule} from "ngx-material-file-input";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {AwaitViewComponent} from "./await-view/await-view.component";
import {GameDeletionNotifComponent} from "./await-view/game-deletion-notif/game-deletion-notif.component";
import {Create3DGameComponent} from "./create3-dgame/create3-dgame.component";
import {DiffCounterComponent} from "./diff-counter/diff-counter.component";
import {EndGameNotifComponent} from "./diff-counter/end-game-notif/end-game-notif.component";
import {FormPostService} from "./form-post.service";
import {GameListComponent} from "./game-list/game-list.component";
import {DeleteGameFormComponent} from "./game-list/game/delete-game-form/delete-game-form.component";
import {GameComponent} from "./game-list/game/game.component";
import {ResetGameFormComponent} from "./game-list/game/reset-game-form/reset-game-form.component";
import {GameService} from "./game.service";
import {InitialViewComponent} from "./initial-view/initial-view.component";
import {KickDialogComponent} from "./kick-dialog/kick-dialog.component";
import {MessageBoxComponent} from "./message-box/message-box.component";
import {PlayViewComponent} from "./play-view/play-view.component";
import {Form3DService} from "./scene-creator/3DFormService/3-dform.service";
import {FreeGameCreatorService} from "./scene-creator/FreeGameCreator/free-game-creator.service";
import {FreeGamePhotoService} from "./scene-creator/free-game-photo-service/free-game-photo.service";
import {Game3DControlsDirective} from "./scene-creator/game-3D-controls/game-3D-controls.directive";
import {SceneCreatorComponent} from "./scene-creator/scene-creator.component";
import {SceneDiffValidatorService} from "./scene-creator/scene-diff-validator.service";
import {SceneRendererService} from "./scene-creator/scene-renderer.service";
import {SimpleGameCreatorFormComponent} from "./simple-game-creator-form/simple-game-creator-form.component";
import {SimpleGameCanvasComponent} from "./simple-game/simple-game-canvas/simple-game-canvas.component";
import {SimpleGameContainerComponent} from "./simple-game/simple-game-container/simple-game-container.component";
import {SimpleGameService} from "./simple-game/simple-game.service";
import {SocketService} from "./socket.service";
import {TimerComponent} from "./timer/timer.component";
import {UNListService} from "./username.service";
import {VueAdminComponent} from "./vue-admin/vue-admin.component";

@NgModule(
  {
    declarations: [
      AppComponent,
      InitialViewComponent,
      GameListComponent,
      GameComponent,
      AppComponent,
      VueAdminComponent,
      Create3DGameComponent,
      SimpleGameCreatorFormComponent,
      PlayViewComponent,
      DiffCounterComponent,
      SceneCreatorComponent,
      SimpleGameCanvasComponent,
      SimpleGameContainerComponent,
      TimerComponent,
      AwaitViewComponent,
      DeleteGameFormComponent,
      ResetGameFormComponent,
      GameDeletionNotifComponent,
      Game3DControlsDirective,
      MessageBoxComponent,
      EndGameNotifComponent,
      KickDialogComponent,
    ],
    imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatIconModule,
      MatInputModule,
      MatFormFieldModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      MaterialFileInputModule,
      MatCardModule,
      MatDialogModule,
      MatSliderModule,
      MatCheckboxModule,
      MatSelectModule,
      MatListModule,
    ],
    providers: [
      UNListService,
      FormPostService,
      GameService,
      SceneRendererService,
      SocketService,
      Form3DService,
      FreeGameCreatorService,
      FreeGamePhotoService,
      SimpleGameService,
      SceneDiffValidatorService,
    ],
    bootstrap: [AppComponent],
    entryComponents: [
      SimpleGameCreatorFormComponent,
      Create3DGameComponent,
      DeleteGameFormComponent,
      ResetGameFormComponent,
      GameDeletionNotifComponent,
      EndGameNotifComponent,
      KickDialogComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
  })
export class AppModule {
}
