import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VueComponent } from './vue/vue.component';
import { GameListComponent } from './game-list/game-list.component';

const routes: Routes = [
    {path: 'initial-view', component: VueComponent},
    {path: 'game-list', component: GameListComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
export const routingComponents = [VueComponent, GameListComponent]