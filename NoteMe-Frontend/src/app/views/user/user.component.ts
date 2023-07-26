import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Note } from 'src/app/interfaces/note.interface';
import { NoteService } from 'src/app/services/note.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  username: string | null;
  publicNotes: Note[] = [];
  pageSlice: Note[] = [];
  pageSize = 9;
  pageIndex = 0;
  userExists: boolean = true;

  constructor(
    private noteService: NoteService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute
  ) {
    this.username = this.activatedRoute.snapshot.paramMap.get('username'); // Get the username from the URL
  }

  ngOnInit() {
    if (this.username !== null) {
      // Fetch public notes of the user using the NoteService
      this.noteService.getPublicNotes(this.username).subscribe(
        (res) => {
          this.publicNotes = res; // Store the fetched public notes in the publicNotes array
          this.updatePageSlice(); // Update the pageSlice array to display the initial page of public notes
        },
        (err) => {
          // Show an error toast notification if there's an error fetching the public notes
          this.toastService.initiate({
            title: 'Error',
            content: `Error obtaining the user's notes`,
          });

          // Set the userExists flag to false to handle the case when the user doesn't exist or has no public notes
          this.userExists = false;
        }
      );
    }
  }

  // Function to update the pageSlice array based on pagination
  updatePageSlice() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Update the pageSlice array with the public notes for the current page
    this.pageSlice = this.publicNotes.slice(startIndex, endIndex);
  }

  // Function to handle page change event (pagination)
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex; // Update the current page index
    this.pageSize = event.pageSize; // Update the number of public notes per page
    this.updatePageSlice(); // Update the pageSlice array to display the new page of public notes
  }
}
