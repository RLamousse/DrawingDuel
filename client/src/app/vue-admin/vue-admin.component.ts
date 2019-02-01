import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-vue-admin',
  templateUrl: './vue-admin.component.html',
  styleUrls: ['./vue-admin.component.css']
})
export class VueAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  createSimpleGame(){
    console.log("sup");
    
    
  }
}
