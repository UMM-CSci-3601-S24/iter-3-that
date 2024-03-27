import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Subject, map, switchMap, takeUntil } from "rxjs";
import { HostService } from "../hosts/host.service";
import { StartedHunt } from "./startedHunt";

@Component({
  selector: 'app-start-hunt-component',
  templateUrl: 'start-hunt.component.html',
  styleUrls: ['./start-hunt.component.scss'],
  providers: [],
  standalone: true,
  imports: []
})

export class StartHuntComponent implements OnInit, OnDestroy {
  startedHunt: StartedHunt;
  error: { help: string, httpResponse: string, message: string };

  private ngUnsubscribe = new Subject<void>();

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private hostService: HostService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.paramMap.pipe(

      map((paramMap: ParamMap) => paramMap.get('accessCode')),

      switchMap((accessCode: string) => this.hostService.getStartedHunt(accessCode)),

      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: startedHunt => {
        this.startedHunt = startedHunt;
        return ;
      },
      error: _err => {
        this.error = {
          help: 'There was a problem starting the hunt – try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        };
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}