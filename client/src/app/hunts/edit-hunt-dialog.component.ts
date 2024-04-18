import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hunt } from '../hunts/hunt';

@Component({
  selector: 'app-edit-hunt-dialog',
  templateUrl: './edit-hunt-dialog.component.html',
})
export class EditHuntDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditHuntDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Hunt
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
