import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from 'src/app/interfaces/note.interface';
import { AuthService } from 'src/app/services/auth.service';
import { NoteService } from 'src/app/services/note.service';
import { ToastService } from 'src/app/services/toast.service';
declare var bootstrap: any;

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent implements OnInit, AfterViewInit {
  noteId: string | null;
  decodedToken: any;
  noteTitle: string = '';
  noteContent: string = '';
  noteColor: string = '#ffffff';
  noteIsFavorite: boolean = false;
  noteIsPrivate: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.noteId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    // Get the current user of the authentication service
    this.decodedToken = this.authService.getUser();

    this.isEdit();
  }

  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl: HTMLElement) => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  makeFavorite() {
    if (this.noteIsFavorite == true) {
      this.noteIsFavorite = false;
    } else {
      this.noteIsFavorite = true;
    }
  }

  makePrivate() {
    if (this.noteIsPrivate == true) {
      this.noteIsPrivate = false;
    } else {
      this.noteIsPrivate = true;
    }
  }

  saveNote() {
    const note: Note = {
      title: this.noteTitle,
      content: this.noteContent,
      color: this.noteColor,
      favorite: this.noteIsFavorite,
      private: this.noteIsPrivate,
    };

    if (this.noteId !== null) {
      // update note
      this.noteService
        .updateNote(note, this.noteId, this.decodedToken._id)
        .subscribe(
          (res) => {
            this.toastService.initiate({
              title: 'Note updated',
              content: `Note updated successfully`,
            });
          },
          (error) => {
            this.toastService.initiate({
              title: 'Error',
              content: `Error during updating the note`,
            });
          }
        );
    } else {
      // new note
      this.noteService.newNote(this.decodedToken._id, note).subscribe(
        (res) => {
          this.toastService.initiate({
            title: 'Note created',
            content: `Note created successfully`,
          });
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.toastService.initiate({
            title: 'Error',
            content: `Error during creating the note`,
          });
        }
      );
    }
  }

  isEdit() {
    if (this.noteId !== null) {
      this.noteService
        .getNoteById(this.decodedToken._id, this.noteId)
        .subscribe(
          (note) => {
            this.noteTitle = note.title;
            this.noteContent = note.content;
            this.noteColor = note.color;
            this.noteIsFavorite = note.favorite;
            this.noteIsPrivate = note.private;
          },
          (error) => {
            console.log('Error fetching note details:', error);
          }
        );
    }
  }
}
