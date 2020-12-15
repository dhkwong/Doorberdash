import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestauranthomeComponent } from './restauranthome/restauranthome.component';
import { CustomerhomeComponent } from './customerhome/customerhome.component';
import { RestaurantupdateComponent } from './restaurantupdate/restaurantupdate.component';
import { CustomerupdateComponent } from './customerupdate/customerupdate.component';
import{CustomerloginregComponent} from './customerloginreg/customerloginreg.component'
import { RestaurantloginregComponent } from './restaurantloginreg/restaurantloginreg.component';

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

  // login component holds registration component as well
  { path: '', pathMatch: 'full', redirectTo: 'restaurantloginreg' },
  { path: 'customerloginreg', component: CustomerloginregComponent },
  {path: 'restaurantloginreg', component: RestaurantloginregComponent},
  //restaurant routes
  {path: 'restaurant', children: [
      { path: 'home', component: RestauranthomeComponent},
      {path: 'update', component: RestaurantupdateComponent},
    ]
  },
  //customer routes
  {path: 'customer', children: [
      { path: 'home', component: CustomerhomeComponent},
      {path:'update', component: CustomerupdateComponent},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
