import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
})
export class PostDetailsComponent {
  postDetails: any;

  constructor(
    public dialogRef: MatDialogRef<PostDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postDetails = data.post;
    console.log(this.postDetails);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
