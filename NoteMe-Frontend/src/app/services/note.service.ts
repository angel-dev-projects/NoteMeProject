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

  getNoteById(id_user: string, id_note: string) {
    // Make an HTTP GET request to the server to get an user's note
    return this.http.get<Note>(`${this.apiUrl}notes/${id_user}/${id_note}`);
  }

  getNotes(id_user: string): Observable<Note[]> {
    // Make an HTTP GET request to the server to get all user's notes
    return this.http.get<Note[]>(`${this.apiUrl}users/${id_user}/notes`);
  }

  newNote(id_user: string, note: Note) {
    // Make an HTTP POST request to the server to create an user's note
    return this.http.post(`${this.apiUrl}notes/${id_user}`, note);
  }

  updateNote(note: Note, id_note: string, id_user: string) {
    // Make an HTTP PUT request to the server to update an user's note
    return this.http.put(
      `${this.apiUrl}users/${id_user}/notes/${id_note}`,
      note
    );
  }

  deleteNote(id_user: string, id_note: string | undefined) {
    // Make an HTTP DELETE request to the server to delete an user's note
    return this.http.delete(`${this.apiUrl}users/${id_user}/notes/${id_note}`);
  }
}
