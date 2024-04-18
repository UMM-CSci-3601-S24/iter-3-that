//import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
//import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
//import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterLink } from "@angular/router";
import { HostService } from "src/app/hosts/host.service";

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule],
})
export class CreateTeamComponent {
  //teamForm: FormGroup;
  members: { name: string }[] = [{ name: '' }];

  teamForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)
    ])),

    member: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(85)
    ])),

  });

  readonly createTeamValidationMessages = {
    name: [
      { type: 'required', message: 'Team name is required' },
      { type: 'minlength', message: 'Team name must be at least 1 character long' },
      { type: 'maxlength', message: 'Team name cannot be more than 50 characters long' }
    ],
    member: [
      { type: 'required', message: 'At least one member is required' },
      { type: 'minlength', message: 'Team name must be at least 1 character long' },
      { type: 'maxlength', message: 'Team name cannot be more than 50 characters long' }
    ],
  };

  constructor(private hostService: HostService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
  }

  createTeam(): void {
    if (this.teamForm.valid) {
      const teamName = this.teamForm.get('name').value;
      const memberNames = this.teamForm.get('member').value.split(',').map(name => name.trim());

      this.hostService.createTeam(teamName, memberNames).subscribe(response => {
        this.router.navigate(['/team', response._id]);
      }, error => {
        console.error('Error creating team:', error);
      });
    }
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
    if (this.teamForm.valid) {
      const teamName = this.teamForm.get('name').value;
      const memberNames = this.teamForm.get('member').value.split(',').map(name => name.trim());

      this.hostService.createTeam(teamName, memberNames).subscribe({
        next: (newTeam) => {
          this.snackBar.open(
            `Added team ${newTeam.teamName}`,
            null,
            { duration: 2000 }
          );
          this.router.navigate(['/team', newTeam._id]);
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

  addMember() {
    this.members.push({ name: '' });
  }

  removeMember(index: number) {
    this.members.splice(index, 1);
  }

}
