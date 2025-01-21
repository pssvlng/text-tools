import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { ContextWord } from '../models/context-word';
import { ContextWordWrapper } from '../models/context-word-wrapper';

@Injectable({
  providedIn: 'root'
})
export class TextAnalyseService {
  
  private tokenize_text_url = 'http://127.0.0.1:5001/api/shared/tokenize/'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
    })
  };

  constructor(private http: HttpClient) { }

  tokenizeText(sent: string, lang: string): Observable<Array<ContextWord[]>> {
    return this.http.post<Array<ContextWord[]>>(`${this.tokenize_text_url}word/`, { lang, sent })
      .pipe(
        tap(_ => this.log('tokenized Text')),
        catchError(this.handleError<Array<ContextWord[]>>('tokenizeText', []))
      );
  }

  tokenizeTextFromUrl(url: string, lang: string): Observable<ContextWordWrapper> {
    return this.http.post<ContextWordWrapper>(`${this.tokenize_text_url}url/`, { lang, url })
      .pipe(
        tap(_ => this.log('tokenized Text from Url')),
        catchError(this.handleError<ContextWordWrapper>('tokenizeTextFromUrl', undefined))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`WordNetService: ${message}`);
  }

}
