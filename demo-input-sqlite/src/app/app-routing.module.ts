import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },  
  { path: 'contacts', loadChildren: './contacts/contact-list/contact-list.module#ContactListPageModule' },
  { path: 'new', loadChildren: './contacts/contact-form/contact-form.module#ContactFormPageModule' },
  { path: 'articles', loadChildren: './contacts/article-list/article-list.module#ArticleListPageModule' },
  { path: 'edit/:id', loadChildren: './contacts/contact-form/contact-form.module#ContactFormPageModule' },
  { path: '**', redirectTo: '/conatcts'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
