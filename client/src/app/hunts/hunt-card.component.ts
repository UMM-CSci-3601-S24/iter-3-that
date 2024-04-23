import { Component, input, Input} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { Hunt } from './hunt';
import { CommonModule } from '@angular/common';
import { HostService } from '../hosts/host.service';
import { MatDialog } from '@angular/material/dialog';
import { EditHuntComponent } from './edit-hunt.component';

@Component({
    selector: 'app-hunt-card',
    templateUrl: './hunt-card.component.html',
    styleUrls: ['./hunt-card.component.scss'],
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule, RouterLink]
})
export class HuntCardComponent {


  hunt = input.required<Hunt>();
  simple = input(true);
  math = Math;
  @Input() context: 'host-profile' | 'hunt-profile' = 'hunt-profile';

  constructor(private hostService: HostService, private router: Router, private dialog: MatDialog) {}

  startHunt(id: string): void {
    this.hostService.startHunt(id).subscribe((accessCode) => {
      this.router.navigate(['/startedHunts/', accessCode]);
    });
  }
  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditHuntComponent, {
      width: '250px',
      data: { hunt: this.hunt }
    });

    dialogRef.afterClosed().subscribe(updatedHunt => {
      if (updatedHunt) {
        this.hunt = updatedHunt;
      }
    });
  }
}


