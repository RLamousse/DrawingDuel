import {HttpClientModule} from "@angular/common/http";
import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatSelectModule, MatSliderModule
} from "@angular/material";
import {MatDialogModule} from "@angular/material/dialog";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MaterialFileInputModule} from "ngx-material-file-input";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import { AwaitViewComponent } from "./await-view/await-view.component";
import { GameDeletionNotifComponent } from "./await-view/game-deletion-notif/game-deletion-notif.component";
import {CompteurDiffComponent} from "./compteur-diff/compteur-diff.component";
import {Create3DGameComponent} from "./create3-dgame/create3-dgame.component";
import {FormPostService} from "./form-post.service";
import {GameListComponent} from "./game-list/game-list.component";
import { DeleteGameFormComponent } from "./game-list/game/delete-game-form/delete-game-form.component";
import {GameComponent} from "./game-list/game/game.component";
import { ResetGameFormComponent } from "./game-list/game/reset-game-form/reset-game-form.component";
import {GameService} from "./game.service";
import {InitialViewComponent} from "./initial-view/initial-view.component";
import { MessageBoxComponent } from "./message-box/message-box.component";
import {PlayViewComponent} from "./play-view/play-view.component";
import {Form3DService} from "./scene-creator/3DFormService/3-dform.service";
import {FreeGameCreatorService} from "./scene-creator/FreeGameCreator/free-game-creator.service";
import {FreeGamePhotoService} from "./scene-creator/free-game-photo-service/free-game-photo.service";
import {SceneCreatorComponent} from "./scene-creator/scene-creator.component";
import {SceneRendererService} from "./scene-creator/scene-renderer.service";
import {SimpleGameCreatorFormComponent} from "./simple-game-creator-form/simple-game-creator-form.component";
import {SimpleGameCanvasComponent} from "./simple-game/simple-game-canvas/simple-game-canvas.component";
import {SimpleGameContainerComponent} from "./simple-game/simple-game-container/simple-game-container.component";
import {SimpleGameService} from "./simple-game/simple-game.service";
import {SocketService} from "./socket.service";
import {TimerComponent} from "./timer/timer.component";
import {UNListService} from "./username.service";
import {VueAdminComponent} from "./vue-admin/vue-admin.component";

@NgModule({
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
    CompteurDiffComponent,
    SceneCreatorComponent,
    SimpleGameCanvasComponent,
    SimpleGameContainerComponent,
    TimerComponent,
    AwaitViewComponent,
    DeleteGameFormComponent,
    ResetGameFormComponent,
    GameDeletionNotifComponent,
    MessageBoxComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialFileInputModule,
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
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [SimpleGameCreatorFormComponent, Create3DGameComponent, DeleteGameFormComponent,
                    ResetGameFormComponent, GameDeletionNotifComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
