import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'recipe',
        data: { pageTitle: 'recipehipsterApp.recipe.home.title' },
        loadChildren: () => import('./recipe/recipe.module').then(m => m.RecipeModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'recipehipsterApp.comment.home.title' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'chefster',
        data: { pageTitle: 'recipehipsterApp.chefster.home.title' },
        loadChildren: () => import('./chefster/chefster.module').then(m => m.ChefsterModule),
      },
      {
        path: 'opinion',
        data: { pageTitle: 'recipehipsterApp.opinion.home.title' },
        loadChildren: () => import('./opinion/opinion.module').then(m => m.OpinionModule),
      },
      {
        path: 'post',
        data: { pageTitle: 'recipehipsterApp.post.home.title' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
