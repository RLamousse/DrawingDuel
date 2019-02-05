import { HttpClientModule } from "@angular/common/http";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule } from "@angular/material";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormPostService } from "./form-post.service";
import { GameListComponent } from "./game-list/game-list.component";
import { GameComponent } from "./game-list/game/game.component";
import { InitialViewComponent } from "./initial-view/initial-view.component";
import { SimpleGameCreatorFormComponent } from "./simple-game-creator-form/simple-game-creator-form.component";
import { UNListService } from "./username.service";
import { WindowEventHandlerDirective } from "./window-event-handler.directive";
import { VueAdminComponent } from './vue-admin/vue-admin.component';

import {MatDialogModule} from '@angular/material';
import {CreateSimpleGame} from './create-simple-game/create-simple-game';
import {Create3DGameComponent} from './create3-dgame/create3-dgame.component'


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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialFileInputModule,
    MatDialogModule,
  ],
  providers: [UNListService, FormPostService],
  bootstrap: [AppComponent],
  entryComponents: [CreateSimpleGame,Create3DGameComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
