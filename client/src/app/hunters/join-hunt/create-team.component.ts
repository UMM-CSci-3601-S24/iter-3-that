import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { HostService } from "src/app/hosts/host.service";

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule, RouterModule, ReactiveFormsModule, FormsModule, MatFormField, MatLabel, MatError],
})
export class CreateTeamComponent {
  teamForm: FormGroup;

  constructor(private hostService: HostService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      memberNames: ['', Validators.required]
    });
  }

  createTeam(): void {
    if (this.teamForm.valid) {
      const teamName = this.teamForm.get('teamName').value;
      const memberNames = this.teamForm.get('memberNames').value.split(',').map(name => name.trim());

      this.hostService.createTeam(teamName, memberNames).subscribe(response => {
        this.router.navigate(['/team', response._id]);
      }, error => {
        console.error('Error creating team:', error);
      });
    }
  }

  submitForm(): void {
    if (this.teamForm.valid) {
      const teamName = this.teamForm.get('teamName').value;
      const memberNames = this.teamForm.get('memberNames').value.split(',').map(name => name.trim());

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
}
