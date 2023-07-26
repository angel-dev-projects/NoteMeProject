import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Note } from 'src/app/interfaces/note.interface';
import { AuthService } from 'src/app/services/auth.service';
import { NoteService } from 'src/app/services/note.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  decodedToken: any;
  userNotes: Note[] = [];
  pageSlice: Note[] = [];
  pageSize = 9;
  pageIndex = 0;
  showFavorites = false;
  showPrivates = false;

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
        this.updatePageSlice();
      },
      (error) => {
        console.log('Error fetching notes:', error);
      }
    );
  }

  updatePageSlice() {
    let filteredNotes = this.userNotes;
  
    if (this.showFavorites) {
      filteredNotes = filteredNotes.filter((note) => note.favorite);
    }
  
    if (this.showPrivates) {
      filteredNotes = filteredNotes.filter((note) => note.private);
    }
  
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pageSlice = filteredNotes.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageSlice();
  }

  deleteNote(id_note: string | undefined) {
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
              this.updatePageSlice();
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
