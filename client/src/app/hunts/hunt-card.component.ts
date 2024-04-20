import { Component, input, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { Hunt } from './hunt';
import { CommonModule } from '@angular/common';
import { HostService } from '../hosts/host.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-hunt-card',
  templateUrl: './hunt-card.component.html',
  styleUrls: ['./hunt-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    MatFormField,
    MatInputModule,
    MatLabel,
    MatError,
    ReactiveFormsModule,
  ],
})
export class HuntCardComponent {
  hunt = input.required<Hunt>();
  simple = input(true);
  math = Math;

  NumberofTeamsForm = new FormGroup({
    numTeam: new FormControl<number>(
      null,
      Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.max(20),
        Validators.pattern('^[0-9]+$'),
      ])
    ),
  });

  readonly numberOfTeamsValidationMessages = {
    numTeam: [
      { type: 'required', message: 'Please provide the number of teams' },
      { type: 'min', message: 'Number of teams must be at least 1' },
      { type: 'max', message: 'Cannot have more than 20 teams' },
      { type: 'pattern', message: 'Must be a number' },
    ],
  };

  @Input() context: 'host-profile' | 'hunt-profile' = 'hunt-profile';

  constructor(private hostService: HostService, private router: Router) {}

  startHunt(id: string): void {
    const numTeams = this.NumberofTeamsForm.get('numTeam').value;
    this.hostService.startHunt(id, numTeams).subscribe((accessCode) => {
      this.router.navigate(['/startedHunts/', accessCode]);
    });
  }

  estHours(minutes: number): number {
    return Math.floor(minutes / 60);
  }

  formControlHasError(controlName: string): boolean {
    return (
      this.NumberofTeamsForm.get(controlName).invalid &&
      (this.NumberofTeamsForm.get(controlName).dirty ||
        this.NumberofTeamsForm.get(controlName).touched)
    );
  }

  getErrorMessage(
    numTeam: keyof typeof this.numberOfTeamsValidationMessages
  ): string {
    for (const { type, message } of this.numberOfTeamsValidationMessages[
      numTeam
    ]) {
      if (this.NumberofTeamsForm.get(numTeam).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }
}
