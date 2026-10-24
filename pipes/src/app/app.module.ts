import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { StudentService } from './Services/student.service';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { PercentagePipe } from './pipes/percentage.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    FilterPipe ,
    PercentagePipe
   ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [StudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
