import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  noteId!: string;
  decodedToken: any;
  noteForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private authService: AuthService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.noteForm = this.fb.group({
      title: '',
      content: '',
      color: '',
    });
  }

  ngOnInit() {
    // Get the current user of the authentication service
    this.decodedToken = this.authService.getUser();

    // Obtener el ID de la nota de la URL usando ActivatedRoute
    this.route.params.subscribe((params) => {
      this.noteId = params['id'];

      // Cargar los detalles de la nota que se desea editar
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
    });
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
    const updatedNote: Note = {
      _id: '',
      title: this.noteForm.value.title,
      content: this.noteForm.value.content,
      color: this.noteForm.value.color,
    };
    this.noteService
      .updateNote(updatedNote, this.noteId, this.decodedToken._id)
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
  }
}
