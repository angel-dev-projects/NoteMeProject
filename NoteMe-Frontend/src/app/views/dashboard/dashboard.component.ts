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
    // Get the current user's decoded token from the authentication service
    this.decodedToken = this.authService.getUser();

    // Fetch the user's notes using the NoteService
    this.noteService.getNotes(this.decodedToken._id).subscribe(
      (res) => {
        this.userNotes = res; // Store the fetched notes in the userNotes array
        this.updatePageSlice(); // Update the pageSlice array to display the initial page of notes
      },
      (error) => {
        console.log('Error fetching notes:', error);
      }
    );
  }

  // Function to update the pageSlice array based on filters and pagination
  updatePageSlice() {
    let filteredNotes = this.userNotes;

    // Apply filters to the notes (showFavorites and showPrivates)
    if (this.showFavorites) {
      filteredNotes = filteredNotes.filter((note) => note.favorite);
    }

    if (this.showPrivates) {
      filteredNotes = filteredNotes.filter((note) => note.private);
    }

    // Calculate the start and end index of the current page
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Update the pageSlice array with the notes for the current page
    this.pageSlice = filteredNotes.slice(startIndex, endIndex);
  }

  // Function to handle page change event (pagination)
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex; // Update the current page index
    this.pageSize = event.pageSize; // Update the number of notes per page
    this.updatePageSlice(); // Update the pageSlice array to display the new page of notes
  }

  // Function to delete a note
  deleteNote(id_note: string | undefined) {
    Swal.fire({
      title: 'Delete note',
      text: 'Are you sure you want to delete this note?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the NoteService's deleteNote method to delete the note
        this.noteService.deleteNote(this.decodedToken._id, id_note).subscribe(
          (res) => {
            // Remove the deleted note from the userNotes array and update the pageSlice array
            const index = this.userNotes.findIndex(
              (note) => note._id === id_note
            );
            if (index !== -1) {
              this.userNotes.splice(index, 1);
              this.updatePageSlice();
            }

            // Show a success toast notification
            this.toastService.initiate({
              title: 'Note deleted',
              content: `Your note has been deleted successfully`,
            });
          },
          (error) => {
            // Show an error toast notification if the note deletion fails
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
