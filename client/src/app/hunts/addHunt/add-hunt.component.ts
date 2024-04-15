import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { HostService } from 'src/app/hosts/host.service';


@Component ({
  selector: 'app-add-hunt',
  templateUrl: './add-hunt.component.html',
  styleUrls: ['./add-hunt.component.scss'],
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule]
})
export class AddHuntComponent {

  addHuntForm = new FormGroup({
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

  readonly addHuntValidationMessages = {
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
    private hostService: HostService,
    private snackBar: MatSnackBar,
    private router: Router) {
    }

  formControlHasError(controlName: string): boolean {
    return this.addHuntForm.get(controlName).invalid &&
      (this.addHuntForm.get(controlName).dirty || this.addHuntForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.addHuntValidationMessages): string {
    for(const {type, message} of this.addHuntValidationMessages[name]) {
      if (this.addHuntForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    this.hostService.addHunt(this.addHuntForm.value).subscribe({
      next: (newId) => {
        this.snackBar.open(
          `Added hunt ${this.addHuntForm.value.name}`,
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


