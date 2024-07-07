import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl = 'https://swapi.dev/api/';

  constructor(private http: HttpClient) { }

  get(url:string): Observable<any>{
    return this.http.get(this.buildUrl(url));
  }

  buildUrl(apiEndPoint:string){
    return `${this.baseUrl}/${apiEndPoint}`
  }

  getPeople(): Observable<any> {
    return this.http.get(`${this.baseUrl}people/`);
  }

  getFilms():Observable<any>{
    return this.http.get(`${this.baseUrl}films/`)
  }

}
