import {RouterModule, Routes} from "@angular/router";

import {CommonModule, DatePipe, registerLocaleData} from "@angular/common";

import {LOCALE_ID, NgModule} from "@angular/core";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzElementPatchModule} from "ng-zorro-antd/core/element-patch";
import {ProjectComponent} from "./components/project/project.component";
import {ProjectsComponent} from "./pages/projects/projects.component";
import {WidgetsComponent} from "./pages/widgets/widgets.component";
import {NzButtonModule} from "ng-zorro-antd/button";

import {NzProgressModule} from "ng-zorro-antd/progress";

import localeRu from '@angular/common/locales/ru';
import { WidgetModalComponent } from './components/widget-modal/widget-modal.component';
import {NzInputModule} from "ng-zorro-antd/input";
import {NzModalModule} from "ng-zorro-antd/modal";
import {FormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {NzCardModule} from "ng-zorro-antd/card";
import { WidgetComponent } from './components/widget/widget.component';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";

const routes: Routes = [
  { path: '', component: WidgetsComponent },
  { path: 'projects', component: ProjectsComponent },
];

registerLocaleData(localeRu);

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    NzProgressModule,
    NzElementPatchModule,
    NzInputModule,
    NzModalModule,
    CommonModule,
    DatePipe,
    FormsModule,
    NzSelectModule,
    CdkDropList,
    CdkDrag,
    NzCardModule,
    NzFormModule,
    NzDatePickerModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }],
  declarations: [
    ProjectsComponent,
    ProjectComponent,
    WidgetsComponent,
    WidgetModalComponent,
    WidgetComponent,
    ProjectModalComponent],
  exports: [ProjectsComponent]
})

export class DashboardModule {}
