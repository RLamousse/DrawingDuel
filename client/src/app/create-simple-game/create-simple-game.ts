import { Component, OnInit, } from '@angular/core';
import { MatDialogRef} from "@angular/material";
@Component({
  selector: 'app-create-simple-game',
  templateUrl: './create-simple-game.html',
  styleUrls: ['./create-simple-game.css']
})
export class CreateSimpleGame implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateSimpleGame>,
   ) { }

  ngOnInit() {
  }
 
  close() {
    this.dialogRef.close();
  }
}
