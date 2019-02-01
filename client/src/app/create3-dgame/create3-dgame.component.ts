import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-create3-dgame',
  templateUrl: './create3-dgame.component.html',
  styleUrls: ['./create3-dgame.component.css']
})
export class Create3DGameComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<Create3DGameComponent>,) { }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close();
  }
}
