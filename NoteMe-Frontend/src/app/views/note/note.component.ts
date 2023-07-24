import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from 'src/app/interfaces/note.interface';
import { AuthService } from 'src/app/services/auth.service';
import { NoteService } from 'src/app/services/note.service';
import { ToastService } from 'src/app/services/toast.service';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent implements OnInit, AfterViewInit {
  noteId: string | null;
  decodedToken: any;
  noteForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private authService: AuthService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.noteForm = this.fb.group({
      title: '',
      content: '',
      color: '#ffffff',
    });

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

  saveNote() {
    const note: Note = {
      title: this.noteForm.value.title,
      content: this.noteForm.value.content,
      color: this.noteForm.value.color,
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
            this.noteForm.setValue({
              title: note.title,
              content: note.content,
              color: note.color,
            });
          },
          (error) => {
            console.log('Error fetching note details:', error);
          }
        );
    }
  }
}
