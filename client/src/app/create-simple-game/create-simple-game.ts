import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from "@angular/material";
@Component({
  selector: 'app-create-simple-game',
  templateUrl: './create-simple-game.html',
  styleUrls: ['./create-simple-game.css']
})
export class CreateSimpleGame implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateSimpleGame>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
 
  close() {
    this.dialogRef.close();
  }
}
