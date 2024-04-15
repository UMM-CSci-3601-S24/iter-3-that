import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { HuntCardComponent } from './hunt-card.component';
import { CompleteHunt } from './completeHunt';
import { HostService } from '../hosts/host.service';
import { AddTaskComponent } from './addTask/add-task.component';
import { MatDivider } from '@angular/material/divider';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-hunt-profile',
  templateUrl: './hunt-profile.component.html',
  styleUrls: ['./hunt-profile.component.scss'],
  standalone: true,
  imports: [
    HuntCardComponent,
    MatCardModule,
    AddTaskComponent,
    MatDivider,
    MatIconButton,
    MatIcon,
    HttpClientModule,
  ],
})
export class HuntProfileComponent implements OnInit, OnDestroy {
  confirmDeleteHunt: boolean = false;
  completeHunt: CompleteHunt;
  error: { help: string; httpResponse: string; message: string };

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private hostService: HostService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((paramMap: ParamMap) => paramMap.get('id')),

        switchMap((id: string) => this.hostService.getHuntById(id)),

        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: (completeHunt) => {
          this.completeHunt = completeHunt;
          return;
        },
        error: (_err) => {
          this.error = {
            help: 'There was a problem loading the hunt – try again.',
            httpResponse: _err.message,
            message: _err.error?.title,
          };
        },
      });
  }

  deleteHunt(id: string): void {
    console.log('Deleting hunt with ID:', id);
    this.hostService.deleteHunt(id).subscribe(() => {
      console.log('Hunt deleted successfully.');
      this.router.navigate(['/hosts']);
    });
  }

  onHuntDeleteClick(event: Event, huntId: string) {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this hunt?')) {
      this.deleteHunt(huntId);
    }
  }

  deleteTask(id: string): void {
    this.hostService.deleteTask(id).subscribe(() => {
      this.completeHunt.tasks = this.completeHunt.tasks.filter(
        (task) => task._id !== id
      );
    });
  }

  onTaskDeleteClick(event: Event, taskId: string) {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      this.deleteTask(taskId);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
