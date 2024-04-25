import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Subject, interval, map, startWith, switchMap, takeUntil } from "rxjs";
import { HostService } from "../hosts/host.service";
import { StartedHunt } from "./startedHunt";
import { MatCard, MatCardActions, MatCardContent } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TeamHunt } from "../hunters/join-hunt/teamHunt";


@Component({
  selector: 'app-start-hunt-component',
  templateUrl: 'start-hunt.component.html',
  styleUrls: ['./start-hunt.component.scss'],
  providers: [],
  standalone: true,
  imports: [MatCard, MatCardContent, MatCardActions, MatIconModule, CommonModule, MatProgressBarModule]
})

export class StartHuntComponent implements OnInit, OnDestroy {
  startedHunt: StartedHunt;
  hunterTeams: TeamHunt[];
  huntBegun = false;
  error: { help: string, httpResponse: string, message: string };

  private ngUnsubscribe = new Subject<void>();
  code: string;

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private hostService: HostService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.paramMap.pipe(

      map((paramMap: ParamMap) => paramMap.get('accessCode')),

      switchMap((accessCode: string) => this.hostService.getStartedHunt(accessCode)),

      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: startedHunt => {
        this.startedHunt = startedHunt;
        console.log(this.startedHunt);
      },
      error: _err => {
        this.error = {
          help: 'There was a problem starting the hunt – try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        };
      }
    });

    this.route.paramMap.pipe(

      map((paramMap: ParamMap) => paramMap.get('accessCode')),

      switchMap((accessCode: string) => this.hostService.getTeamsByCode(this.code = accessCode)),

      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: hunters => {
        this.hunterTeams = hunters;
        console.log(this.hunterTeams);
        console.log('Code: ' + this.code);
        return ;
      },
      error: _err => {
        this.error = {
          help: 'There was a problem retrieving hunters – try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        };
      }
    });

    interval(2000) // 2000 ms = 2 seconds
    .pipe(
      startWith(0), // start immediately on load
      switchMap(() => this.hostService.getTeamsByCode(this.code))
    )
    .subscribe(
      hunters => {
        this.hunterTeams = hunters;
        console.log('refreshed hunterTeams');
      },
      error => console.error('Error fetching hunter teams', error)
    );
  }

  beginHunt() {
    this.huntBegun = true;
  }

  onEndHuntClick(event: Event) {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to end this hunt?')) {
      this.endHunt();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  endHunt(): void {
    this.hostService.endStartedHunt(this.startedHunt._id)
      .subscribe({
        next: () => {
          this.snackBar.open('Hunt ended successfully', 'Close', {
            duration: 2000,
          });
          this.router.navigate(['/hosts']); // Navigate to home page after ending the hunt
        },
        error: _err => {
          this.error = {
            help: 'There was a problem ending the hunt – try again.',
            httpResponse: _err.message,
            message: _err.error?.title,
          };
        }
      });
  }

  returnPercent(teamInput: TeamHunt): number {
    let numTrue = 0;
    const progress = teamInput.tasks;
     for(const val of progress)
     {
        if(val.status)
        {
          numTrue++;
        }
     }
     return ((numTrue * 100.0)/progress.length);
    }

}
