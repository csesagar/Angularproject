import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { CoursesComponent } from './courses/courses.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { LoginComponent } from './login/login.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PopularComponent } from './home/popular/popular.component';
import { AuthGuardService } from './Services/authguard.service';
import {CanActivate, CanActivateChild, resolve} from './auth.guard';


const routes: Routes = [
 {
    path: '',
    component: HomeComponent,   // This route is configured to load the Home component when the user navigates to the root path of the application. The empty string '' represents the root path, and the Home component will be displayed in the router outlet when this route is activated.
  },
  // {
  //   path: '',
  //   redirectTo: 'home',  // redirectTo is used to redirect the user to a different route when they access the root path. In this case, it redirects to the 'home' route.
  //   pathMatch: 'full'   // full means that the whole URL path needs to match and is consumed by the route matching algorithm.
  // },
   {
    path: 'Contact',
    component: ContactComponent,  // This route is configured to load the Contact component when the user navigates to the '/contact' path. The Contact component will be displayed in the router outlet when this route is activated.
  //  canDeactivate: [AuthGuardService]  // canDeactivate is used to prevent the user from navigating away from the Contact component if certain conditions are not met. In this case, it uses the AuthGuardService to determine if the user can navigate away from the Contact component.
     canDeactivate: [(comp: ContactComponent) => {return comp.canExit();}]
},
   {
    path: 'Courses',
    component: CoursesComponent,  // This route is configured to load the Courses component when the user navigates to the '/courses' path. The Courses component will be displayed in the router outlet when this route is activated.
    // resolve: {courses: AuthGuardService}  // resolve is used to pre-fetch data before the route is activated. In this case, it uses the resolve function to fetch the courses data before loading the Courses component.
       resolve: {courses: resolve}
  },
   {
    path: 'Home',
    component: HomeComponent,
  },
   {
    path: 'Login',
    component: LoginComponent,
  },
   {
    path: 'About',
    component: AboutComponent,
    canActivate: [CanActivate]
  },
    {path: 'Courses',canActivateChild: [CanActivateChild], children: [
      {path: 'Course/:id', component: CourseDetailComponent}, 
       {path: 'Popular', component: PopularComponent},
      {path: 'Checkout', component: CheckoutComponent }
      // {path: 'Checkout', component: CheckoutComponent , data :{name:'Test course'}}
    ]},
   {
    path: '**',
    component: NotFoundComponent,  // The '**' path is a wildcard route that matches any URL that doesn't match the defined routes. It is typically used to display a "Not Found" page or redirect the user to a specific route when they enter an invalid URL.
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],  // The RouterModule.forRoot() method is used to configure the router at the application's root level. It takes the routes array as an argument and sets up the router with the defined routes. The enableTracing option is set to true, which enables detailed logging of router events for debugging purposes.
  exports: [RouterModule] 
})
export class AppRoutingModule { }
