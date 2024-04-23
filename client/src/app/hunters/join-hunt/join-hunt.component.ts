import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HostService } from 'src/app/hosts/host.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-join-hunt',
  standalone: true,
  imports: [
    MatInputModule,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './join-hunt.component.html',
  styleUrl: './join-hunt.component.scss'
})
export class JoinHuntComponent {

  isAccessCodeValid = false;
  startedHuntId: string;
  accessCode: string;
  errorMessage: string;
  userName: string;

  constructor(private hostService: HostService, private router: Router, private snackBar: MatSnackBar) { }

  @ViewChild('input1') input1: ElementRef;
  @ViewChild('input2') input2: ElementRef;
  @ViewChild('input3') input3: ElementRef;
  @ViewChild('input4') input4: ElementRef;
  @ViewChild('input5') input5: ElementRef;
  @ViewChild('input6') input6: ElementRef;

  /**
   * This is for typing in the access code input and moving to
   * the next input box when a number is typed in.
   *
   * @param event
   * @param inputNumber
   */
  onKeyUp(event, inputNumber) {
    if (event.target.value.length) {
      switch (inputNumber) {
        case 1: this.input2.nativeElement.focus(); break;
        case 2: this.input3.nativeElement.focus(); break;
        case 3: this.input4.nativeElement.focus(); break;
        case 4: this.input5.nativeElement.focus(); break;
        case 5: this.input6.nativeElement.focus(); break;
      }
      this.checkAccessCode();
    }
  }

  /**
   * This is for deleting in access code input and move to
   * the next input box when a number is deleted.
   *
   * @param event
   * @param inputNumber
   */
  onKeyDown(event, inputNumber) {
    if (event.key === 'Backspace' && !event.target.value.length) {
      switch (inputNumber) {
        case 2: this.input1.nativeElement.focus(); break;
        case 3: this.input2.nativeElement.focus(); break;
        case 4: this.input3.nativeElement.focus(); break;
        case 5: this.input4.nativeElement.focus(); break;
        case 6: this.input5.nativeElement.focus(); break;
      }
    }
  }

  /**
   * This is for pasting in access code input and prevent not
   * number access code being pasted in.
   */
  onPaste(event: ClipboardEvent) {
    // Get the pasted data as a string
    event.preventDefault();
    let pasteData = event.clipboardData.getData('text');
    pasteData = pasteData.replace(/\D/g, '');

    // Split the string into an array of characters
    const characters = pasteData.split('');

    // Assign the characters to the input fields
    if (characters.length >= 1) this.input1.nativeElement.value = characters[0];
    if (characters.length >= 2) this.input2.nativeElement.value = characters[1];
    if (characters.length >= 3) this.input3.nativeElement.value = characters[2];
    if (characters.length >= 4) this.input4.nativeElement.value = characters[3];
    if (characters.length >= 5) this.input5.nativeElement.value = characters[4];
    if (characters.length >= 6) this.input6.nativeElement.value = characters[5];
  }

  /**
   * This is for preventing typing in character access code.
   * This will do nothing if the access code being typed in is number.
   */
  numericOnly(event: KeyboardEvent) {
    if (!/\d/.test(event.key)) {
      event.preventDefault();
    }
  }

  checkAccessCode() {
    this.accessCode = [this.input1.nativeElement.value, this.input2.nativeElement.value, this.input3.nativeElement.value, this.input4.nativeElement.value, this.input5.nativeElement.value, this.input6.nativeElement.value].join('');
    if (this.accessCode.length === 6) {
      this.hostService.getStartedHunt(this.accessCode).subscribe({
        next: startedHunt => {
          this.isAccessCodeValid = true;
          this.startedHuntId = startedHunt._id;
        },
        error: () => {
          this.isAccessCodeValid = false;
          this.snackBar.open('Invalid access code. No hunt was found.', 'Close', {
            duration: 6000,
          });
        }
      });
    }
  }
}
