import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { Router, RouterModule } from "@angular/router";
import { HostService } from "src/app/hosts/host.service";

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule, RouterModule],
})
export class CreateTeamComponent {
  teamForm: FormGroup;

  constructor(private hostService: HostService, private fb: FormBuilder, private router: Router) {
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
}
