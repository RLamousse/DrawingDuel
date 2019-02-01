import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { AppComponent } from "./app.component";
import { IndexService } from "./index.service";
import { SimpleGameCreatorFormComponent } from "./simple-game-creator-form/simple-game-creator-form.component";

@NgModule({
  declarations: [
    AppComponent,
    SimpleGameCreatorFormComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatFormFieldModule,
    MaterialFileInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    BrowserAnimationsModule,
  ],
  providers: [IndexService],
  bootstrap: [AppComponent],
})
export class AppModule { }
