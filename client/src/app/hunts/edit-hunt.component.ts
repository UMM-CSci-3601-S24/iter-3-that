import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { HostService } from "../hosts/host.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hunt } from "./hunt";
import { MatFormField, MatLabel } from "@angular/material/form-field";

@Component ({
  selector: 'app-edit-hunt',
  templateUrl: './edit-hunt.component.html',
  imports: [ReactiveFormsModule, MatFormField, MatLabel],
  standalone: true,
})
export class EditHuntComponent {

  editHuntForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)
    ])),

    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(85)
    ])),

    est: new FormControl<number>(null, Validators.compose([
      Validators.required,
      Validators.min(0),
      Validators.max(240),
      Validators.pattern('^[0-9]+$')
    ])),
  });
  readonly editHuntValidationMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 1 character long' },
      { type: 'maxlength', message: 'Name cannot be more than 50 characters long' }
    ],

    description: [
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {width: number, hunt: Hunt},
    private hostService: HostService,
    private snackBar: MatSnackBar,
    private router: Router)
    {
  }

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
    this.hostService.updateHunt(this.data.hunt._id, this.editHuntForm.value).subscribe({
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
