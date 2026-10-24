import { Injectable, inject } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
  HttpEventType,
} from "@angular/common/http";
import { Task } from "../Model/Task";
import { map, catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";
import { LoggingService } from "./Logging.Service";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  http: HttpClient = inject(HttpClient);
  loggingService: LoggingService = inject(LoggingService);
  errorSubject = new Subject<HttpErrorResponse>();

  CreateTask(task: Task) {
    const headers = new HttpHeaders({ "my-header": "hello world" });
    this.http
      .post<{
        name: string;
      }>(
        "https://angularhttpclient-bf6c9-default-rtdb.firebaseio.com/tasks.json",
        task,
        { headers: headers },
      ).pipe( catchError((error: HttpErrorResponse) => {
        const errorObj = {statusCode: error.status, errorMessage: error.message, datetime: new Date()}
        this.loggingService.logError(errorObj);
        return throwError(() => error);
        }))
      .subscribe({
        error: (error) => {
          this.errorSubject.next(error);
        }, 
      });
  }

  DeleteTask(id: string | undefined) {
    this.http
      .delete(
        `https://angularhttpclient-bf6c9-default-rtdb.firebaseio.com/tasks/${id}.json`,
      ).pipe( catchError((error: HttpErrorResponse) => {
        const errorObj = {statusCode: error.status, errorMessage: error.message, datetime: new Date()}
        this.loggingService.logError(errorObj);
        return throwError(() => error);
        }))
      .subscribe({
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }

  DeleteAllTasks() {
    this.http
      .delete(
        "https://angularhttpclient-bf6c9-default-rtdb.firebaseio.com/tasks.json",{ observe: 'events'}
      ).pipe(tap((event) => {
            console.log(event);
            if(event.type === HttpEventType.Sent){

            }
        })  , catchError((error: HttpErrorResponse) => {
        const errorObj = {statusCode: error.status, errorMessage: error.message, datetime: new Date()}
        this.loggingService.logError(errorObj);
        return throwError(() => error);
        }))
      .subscribe({
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }

  //   GetAlltasks() {
  //   return this.http
  //       .get<{ [key: string]: Task }>(
  //         "https://angularhttpclient-bf6c9-default-rtdb.firebaseio.com/tasks.json",
  //       )
  //       .pipe(
  //         map((response) => {
  //           let tasksArray: Task[] = [];
  //           for (const key in response) {
  //             if (response.hasOwnProperty(key)) {
  //               tasksArray.push({ ...response[key], id: key });
  //             }
  //           }
  //           return tasksArray;
  //         })
  //       )
  //   }

  GetAlltasks() {
      let headers = new HttpHeaders();
        // headers = headers.set('content-type', 'application/json');  //set is used to set a new value for the header, replacing any existing value.
        headers = headers.append('content-type', 'application/json');   // append is used to add a new value for the header, without replacing any existing value.
        headers = headers.append('content-type', 'text/html')

        let queryParams = new HttpParams();
        queryParams = queryParams.set('page', 2);
        queryParams = queryParams.set('item', 10)
    return this.http
      .get<{
        [key: string]: Task;
      }>("https://angularhttpclient-bf6c9-default-rtdb.firebaseio.com/tasks.json",
        {headers: headers, params: queryParams, observe: 'body'})
      .pipe(
        map((response) => {
          let tasksArray: Task[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              tasksArray.push({ ...response[key], id: key });
            }
          }
          return tasksArray;
        }),
        catchError((error: HttpErrorResponse) => {
        const errorObj = {statusCode: error.status, errorMessage: error.message, datetime: new Date()}
        this.loggingService.logError(errorObj);
        return throwError(() => error);
        }),
      );
  }

  UpdateTask(id: string, task: Task) {
    this.http
      .put(
        `https://angularhttpclient-bf6c9-default-rtdb.firebaseio.com/tasks/${id}.json`,
        task,
      ).pipe( catchError((error: HttpErrorResponse) => {
        const errorObj = {statusCode: error.status, errorMessage: error.message, datetime: new Date()}
        this.loggingService.logError(errorObj);
        return throwError(() => error);
        }))
      .subscribe({
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }

   getTaskDetails(id: string | undefined){
        return this.http.get('https://angularhttpclient-bf6c9-default-rtdb.firebaseio.com/tasks/'+id+'.json')
        .pipe(map((response) => {
            console.log(response)
            let task = {};
            task = {...response, id: id}
            return task;
        }))
    }
}
