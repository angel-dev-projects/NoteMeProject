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
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
  }

  ngOnInit() {
    if (this.username !== null) {
      this.noteService.getPublicNotes(this.username).subscribe(
        (res) => {
          this.publicNotes = res;
          this.updatePageSlice();
        },
        (err) => {
          this.toastService.initiate({
            title: 'Error',
            content: `Error obtaining the user's notes`,
          });
          this.userExists = false;
        }
      );
    }
  }

  updatePageSlice() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pageSlice = this.publicNotes.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageSlice();
  }
}
