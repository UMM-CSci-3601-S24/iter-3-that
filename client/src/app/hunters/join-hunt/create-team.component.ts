import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { HostService } from "src/app/hosts/host.service";

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule],
})
export class CreateTeamComponent {
  //memberArray: { name: string }[] = [{ name: '' }];

  teamForm = new FormGroup({
    teamName: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)
    ])),

    members: new FormArray([
      new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(85)
      ]))
    ]),

    startedHuntId: new FormControl(''),

  });

  readonly createTeamValidationMessages = {
    teamName: [
      { type: 'required', message: 'Team name is required' },
      { type: 'minlength', message: 'Team name must be at least 1 character long' },
      { type: 'maxlength', message: 'Team name cannot be more than 50 characters long' }
    ],
    members: [
      { type: 'required', message: 'At least one member is required' },
      { type: 'minlength', message: 'Team name must be at least 1 character long' },
      { type: 'maxlength', message: 'Team name cannot be more than 50 characters long' }
    ],
  };

  constructor(private hostService: HostService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {
  }

  formControlHasError(controlName: string): boolean {
    return this.teamForm.get(controlName).invalid &&
      (this.teamForm.get(controlName).dirty || this.teamForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.createTeamValidationMessages): string {
    for(const {type, message} of this.createTeamValidationMessages[name]) {
      if (this.teamForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.teamForm.get('startedHuntId').setValue(id);
    this.hostService.createTeam(this.teamForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Team created successfully', 'Close', {
          duration: 5000
        });
        this.router.navigate(['/team', response]);
      },
      error: (err) => {
        console.error('Error creating team:', err);
        this.snackBar.open('Error creating team', 'Close', {
          duration: 5000
        });
      }
    });
  }

  addMember() {
    (this.teamForm.get('members') as FormArray).push(new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(85)
    ])));
  }

  removeMember(index: number) {
    (this.teamForm.get('members') as FormArray).removeAt(index);
  }

  get members() {
    return this.teamForm.get('members') as FormArray;
  }

}
