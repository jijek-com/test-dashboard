import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Widget} from "../../types/widgets.type";
import {ProjectsService} from "../../services/projects.service";
import {Project} from "../../types/projects.type";
import {NzModalService} from "ng-zorro-antd/modal";
import {WidgetModalComponent} from "../widget-modal/widget-modal.component";

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent {
  @Input() widget!: Widget;
  @Input() project?: Project;

  @Output() widgetUpdated = new EventEmitter<Widget>();

  constructor(
    private modal: NzModalService,
    private _projectService: ProjectsService) {
  }

  get progress(): number | undefined {
    return this.project ? Math.round((this.project.tasksCompleted / this.project.tasksTotal) * 100) : undefined;
  }

  editWidget(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Редактировать виджет',
      nzContent: WidgetModalComponent,
      nzFooter: null,
      nzData: { widget: { ...this.widget } }
    });

    modalRef.afterClose.subscribe((result: Widget | null) => {
      if (result) {
        this.widgetUpdated.emit(result);
      }
    });
  }

  removeWidget(index: number): void {
    this.modal.confirm({
      nzTitle: 'Вы уверены, что хотите удалить этот виджет?',
      nzContent: 'Это действие необратимо.',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this._projectService.removeWidget(this.widget.id);
      },
      nzOnCancel: () => {
        console.log('Удаление отменено');
      }
    });
  }
}
