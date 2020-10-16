import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import components


const routes: Routes = [
//   { path: '', pathMatch: 'full', redirectTo:"movies" },
//   {path: 'movies',children:[
//     {path:'', component:MovielistComponent},
//     {path:'new',component:CreatemovieComponent},
//     {path:':id/review', component:AddreviewComponent},
//     {path:':id', component:ShowmovieComponent}
//   ]
// },
// { path: '**', component: MovielistComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
