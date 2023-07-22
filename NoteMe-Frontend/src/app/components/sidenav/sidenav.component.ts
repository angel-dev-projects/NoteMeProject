import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/interfaces/note.interface';
import { AuthService } from 'src/app/services/auth.service';
import { NoteService } from 'src/app/services/note.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  showFiller = false;
  decodedToken: any;
  userNotes: Note[] = [];

  constructor(
    private noteService: NoteService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Get the current user of the authentication service
    this.decodedToken = this.authService.getUser();

    this.noteService.getNotes(this.decodedToken._id).subscribe(
      (res) => {
        this.userNotes = res;
      },
      (error) => {
        console.log('Error fetching notes:', error);
      }
    );
  }
}
