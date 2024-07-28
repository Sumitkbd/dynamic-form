import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
@Component({
  selector: 'app-submit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogTitle, MatDialogContent],
  templateUrl: './submit-dialog.component.html',
  styleUrl: './submit-dialog.component.css',
})
export class SubmitDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string | any) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
