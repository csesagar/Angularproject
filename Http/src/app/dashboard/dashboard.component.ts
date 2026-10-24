import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { Task } from "../Model/Task";
import { map } from "rxjs/operators";
import { TaskService } from "../services/task.service";
import { Subscription } from 'rxjs';
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit , OnDestroy {
  http: HttpClient = inject(HttpClient);
  showCreateTaskForm: boolean = false;
  allTasks: any[] = [];
  taskService: TaskService = inject(TaskService);
  editMode: boolean = false;
  selectedTask: Task;
  currentTaskId: string = "";
  isLoading: boolean = false;
  errorMessage: string | null = null;
 errorSub: Subscription;
  showTaskDetails: boolean = false;
  currentTask: Task | null = null;
  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {
      title: "", 
      desc: "",
      assignedTo: "",
      createdAt: "",
      priority: "",
      status: "",
    };
  }

  ngOnInit() {
    this.fetchAllTasks();
     this.errorSub = this.taskService.errorSubject.subscribe({next: (httpError) => {
      this.setErrorMessage(httpError);
    }})
  }
    ngOnDestroy(){
    this.errorSub.unsubscribe();
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
    this.editMode = false;
  }
  CreateOrUpdateTask(taskData: any) {
    if (!this.editMode) this.taskService.CreateTask(taskData);
    else this.taskService.UpdateTask(this.currentTaskId, taskData);
  }

  FetchAllTaskClicked() {
    this.fetchAllTasks();
  }

  DeleteTask(taskId: string) {
    this.taskService.DeleteTask(taskId);
  }
  OnEditTaskClicked(taskId: string) {
    this.currentTaskId = taskId;
    this.showCreateTaskForm = true;
    this.editMode = true;
    this.selectedTask = this.allTasks.find((task) => {
      return task.id === taskId;
    });
  }
   showCurrentTaskDetails(id: string | undefined){
    this.showTaskDetails = true;
    this.taskService.getTaskDetails(id).subscribe({next: (data: Task) => {
      this.currentTask = data;
      console.log(this.currentTask);
    }});
  }

  CloseTaskDetails(){ 
    this.showTaskDetails = false;
  }

  private fetchAllTasks() {
    this.isLoading = true;
    this.taskService.GetAlltasks().subscribe({
      next: (response) => {
        this.allTasks = response;
        this.isLoading = false;
      },
      error: (error) => {
        // this.errorMessage = error.message;
        this.setErrorMessage(error);
        this.isLoading = false;
      },
    });
  }

  DeleteAllTask() {
    this.taskService.DeleteAllTasks();
  }
  private setErrorMessage(err: HttpErrorResponse) {
    console.log(err);
    if (err.error.error === "Permission denied") {
      this.errorMessage = "You do not have permisssion to perform this action";
    } else {
      this.errorMessage = err.message;
    }
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  
}
