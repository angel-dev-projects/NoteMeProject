import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Note } from '../interfaces/note.interface';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getNotes(id_user: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}users/${id_user}/notes`);
  }

  updateNote(note: Note, id_note: string, id_user: string) {
    // Make an HTTP PUT request to the server to update an user's note
    return this.http.put(
      `${this.apiUrl}users/${id_user}/notes/${id_note}`,
      note
    );
  }
}
