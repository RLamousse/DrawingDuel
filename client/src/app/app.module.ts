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
import { WindowEventHandler } from "./window-event-handler.directive";
import { GameComponent } from './game-list/game/game.component';
import { VueAdminComponent } from './vue-admin/vue-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    VueComponent,
    GameListComponent,
    WindowEventHandler,
    GameComponent,
    AppComponent,
    VueAdminComponent
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
  ],
  providers: [IndexService, UNListService],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
