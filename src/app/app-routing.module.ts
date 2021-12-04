import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  }, {
    path: 'about', loadChildren: () => import('./modules/about/about.module').then(m => m.AboutModule)
  }, {
    path: 'portfolio', loadChildren: () => import('./modules/portfolio/portfolio.module').then(m => m.PortfolioModule)
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
