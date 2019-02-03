import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from "@angular/material";

@Component({
  selector: 'app-create3-dgame',
  templateUrl: './create3-dgame.component.html',
  styleUrls: ['./create3-dgame.component.css']
})
export class Create3DGameComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<Create3DGameComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  
  close() {
    this.dialogRef.close();
  }
}
