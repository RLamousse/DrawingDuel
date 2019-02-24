import { HttpClientModule } from "@angular/common/http";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatSliderModule
} from "@angular/material";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CompteurDiffComponent } from "./compteur-diff/compteur-diff.component";
import {Create3DGameComponent} from "./create3-dgame/create3-dgame.component";
import { FormPostService } from "./form-post.service";
import { GameListComponent } from "./game-list/game-list.component";
import { GameComponent } from "./game-list/game/game.component";
import { GameService } from "./game.service";
import { InitialViewComponent } from "./initial-view/initial-view.component";
import { PlayViewComponent } from "./play-view/play-view.component";
import { Form3DService } from "./scene-creator/3DFormService/3-dform.service";
import { FreeGameCreatorService } from "./scene-creator/FreeGameCreator/free-game-creator.service";
import { FreeGamePhotoService } from "./scene-creator/free-game-photo-service/free-game-photo.service";
import { SceneCreatorComponent } from "./scene-creator/scene-creator.component";
import { SceneRendererService } from "./scene-creator/scene-renderer.service";
import { SimpleGameCreatorFormComponent } from "./simple-game-creator-form/simple-game-creator-form.component";
import { SocketService } from "./socket.service";
import { UNListService } from "./username.service";
import { VueAdminComponent } from "./vue-admin/vue-admin.component";
import { WindowEventHandlerDirective } from "./window-event-handler.directive";

@NgModule({
  declarations: [
    AppComponent,
    InitialViewComponent,
    GameListComponent,
    WindowEventHandlerDirective,
    GameComponent,
    AppComponent,
    VueAdminComponent,
    Create3DGameComponent,
    SimpleGameCreatorFormComponent,
    PlayViewComponent,
    CompteurDiffComponent,
    SceneCreatorComponent,
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
  ],
  bootstrap: [AppComponent],
  entryComponents: [SimpleGameCreatorFormComponent, Create3DGameComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
