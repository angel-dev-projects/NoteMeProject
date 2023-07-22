import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/interfaces/note.interface';
import { AuthService } from 'src/app/services/auth.service';
import { NoteService } from 'src/app/services/note.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';

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

  deleteNote(id_note: string) {
    Swal.fire({
      title: 'Delete note',
      text: 'Are you sure you want to delete this note?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
    }).then((result) => {
      if (result.isConfirmed) {
        this.noteService.deleteNote(this.decodedToken._id, id_note).subscribe(
          (res) => {
            const index = this.userNotes.findIndex(
              (note) => note._id === id_note
            );
            if (index !== -1) {
              this.userNotes.splice(index, 1);
            }
            this.toastService.initiate({
              title: 'Note deleted',
              content: `Your note has been deleted successfully`,
            });
          },
          (error) => {
            this.toastService.initiate({
              title: 'Error',
              content: `Error deleting the note`,
            });
          }
        );
      }
    });
  }
}
