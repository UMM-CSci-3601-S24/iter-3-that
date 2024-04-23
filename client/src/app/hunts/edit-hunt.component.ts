import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { HostService } from "../hosts/host.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterLink } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Hunt } from "./hunt";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

@Component ({
  selector: 'app-edit-hunt',
  templateUrl: './edit-hunt.component.html',
  styleUrls: ['./edit-hunt.component.scss'],
  imports: [CommonModule,RouterLink, FormsModule, ReactiveFormsModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule,
    MatDialogTitle, MatDialogContent],
  standalone: true,
})
export class EditHuntComponent implements OnInit {

  hunt: Hunt;
  editHuntForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public huntToEdit: { huntToEdit: Hunt },
    private hostService: HostService,
    private snackBar: MatSnackBar,
    private router: Router)
    {
      this.hunt = huntToEdit.huntToEdit;
  }

  ngOnInit(): void {
    this.editHuntForm = new FormGroup({
      name: new FormControl(this.hunt.name, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ])),

      description: new FormControl(this.hunt.description, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(85)
      ])),

      est: new FormControl<number>(this.hunt.est, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(240),
        Validators.pattern('^[0-9]+$')
      ])),
    });

  }

  readonly editHuntValidationMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 1 character long' },
      { type: 'maxlength', message: 'Name cannot be more than 50 characters long' }
    ],

    description: [
      { type: 'minlength', message: 'Description must be at least 1 character long'},
      { type: 'maxlength', message: 'Description cannot be more than 85 characters long' },
      { type: 'required', message: 'Description is required' }
    ],

    est: [
      { type: 'required', message: 'Estimated time is required' },
      { type: 'min', message: 'Estimated time must be at least 0' },
      { type: 'max', message: 'Estimated time cannot be more than 4 hours' },
      { type: 'pattern', message: 'Estimated time must be a number' }
    ]
  };

  formControlHasError(controlName: string): boolean {
    return this.editHuntForm.get(controlName).invalid &&
      (this.editHuntForm.get(controlName).dirty || this.editHuntForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.editHuntValidationMessages): string {
    for(const {type, message} of this.editHuntValidationMessages[name]) {
      if (this.editHuntForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    this.hostService.updateHunt(this.hunt._id, this.editHuntForm.value).subscribe({
      next: (newId) => {
        this.snackBar.open(
          `Edited hunt ${this.editHuntForm.value.name}`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/hunts/', newId]);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
    });
  }
}
