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
    this.noteId = this.activatedRoute.snapshot.paramMap.get('id'); // Get the note ID from the URL
  }

  ngOnInit() {
    // Get the current user's decoded token from the authentication service
    this.decodedToken = this.authService.getUser();

    this.isEdit(); // Check if the component is in edit mode and populate note details if necessary
  }

  ngAfterViewInit() {
    // Get all elements with "data-bs-toggle='tooltip'"
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    // Initialize Bootstrap tooltips for each tooltip element found
    tooltipTriggerList.map((tooltipTriggerEl: HTMLElement) => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Function to toggle the "favorite" flag of the note
  makeFavorite() {
    this.noteIsFavorite = !this.noteIsFavorite;
  }

  // Function to toggle the "private" flag of the note
  makePrivate() {
    this.noteIsPrivate = !this.noteIsPrivate;
  }

  // Function to save the note (either as an update or as a new note)
  saveNote() {
    const note: Note = {
      title: this.noteTitle,
      content: this.noteContent,
      color: this.noteColor,
      favorite: this.noteIsFavorite,
      private: this.noteIsPrivate,
    };

    if (this.noteId !== null) {
      // Update an existing note
      this.noteService
        .updateNote(note, this.noteId, this.decodedToken._id)
        .subscribe(
          (res) => {
            // Show a success toast notification
            this.toastService.initiate({
              title: 'Note updated',
              content: `Note updated successfully`,
            });
          },
          (error) => {
            // Show an error toast notification if the note update fails
            this.toastService.initiate({
              title: 'Error',
              content: `Error during updating the note`,
            });
          }
        );
    } else {
      // Create a new note
      this.noteService.newNote(this.decodedToken._id, note).subscribe(
        (res) => {
          // Show a success toast notification
          this.toastService.initiate({
            title: 'Note created',
            content: `Note created successfully`,
          });

          // Navigate back to the dashboard after creating a new note
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          // Show an error toast notification if the note creation fails
          this.toastService.initiate({
            title: 'Error',
            content: `Error during creating the note`,
          });
        }
      );
    }
  }

  // Function to check if the component is in edit mode and fetch note details if necessary
  isEdit() {
    if (this.noteId !== null) {
      // Get the details of the note with the provided ID
      this.noteService
        .getNoteById(this.decodedToken._id, this.noteId)
        .subscribe(
          (note) => {
            // Populate the component properties with the note details
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
