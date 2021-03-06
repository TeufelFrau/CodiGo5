import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedComponent } from './logged.component';
import { HomeComponent } from './components/home/home.component';
import { HorarioAulaComponent } from './components/horario-aula/horario-aula.component';
const MIS_RUTAS: Routes = [
    {
        path:'',
        component: LoggedComponent,
        children:[
            {
                path:'',
                component: HomeComponent
            },
            {
                path:'horariosxaula',
                component: HorarioAulaComponent
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(MIS_RUTAS)],
    exports: [RouterModule]
})
export class LoggedRoutingModule { }
