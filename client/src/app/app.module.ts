import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GameListComponent } from "./game-list/game-list.component";
import { IndexService } from "./index.service";
import { UNListService } from "./username.service";
import { VueComponent } from "./vue/vue.component";
import { WindowEventHandlerDirective } from "./window-event-handler.directive";
import { GameComponent } from './game-list/game/game.component';
import { VueAdminComponent } from './vue-admin/vue-admin.component';

import {MatDialogModule} from '@angular/material';
import {CreateSimpleGame} from './create-simple-game/create-simple-game';
import {Create3DGameComponent} from './create3-dgame/create3-dgame.component'


@NgModule({
  declarations: [
    AppComponent,
    VueComponent,
    GameListComponent,
    WindowEventHandlerDirective,
    GameComponent,
    AppComponent,
    VueAdminComponent,
    CreateSimpleGame,
    Create3DGameComponent,
    
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
    MatDialogModule
  
  ],
  providers: [IndexService, UNListService],
  bootstrap: [AppComponent],
  entryComponents: [CreateSimpleGame,Create3DGameComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
