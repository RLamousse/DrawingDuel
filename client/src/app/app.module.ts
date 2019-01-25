import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { IndexService } from "./index.service";
import { HttpClientModule } from "@angular/common/http";
import { VueComponent } from './vue/vue.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UNListService } from "./username.service";
 
@NgModule({
  declarations: [
    AppComponent,
    VueComponent
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
    BrowserAnimationsModule
  ],
  providers: [IndexService, UNListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
