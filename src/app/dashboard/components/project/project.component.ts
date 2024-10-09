import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Project} from "../../types/projects.type";
import {Widget} from "../../types/widgets.type";
import {NzModalService} from "ng-zorro-antd/modal";
import {ProjectModalComponent} from "../project-modal/project-modal.component";
import {ProjectsService} from "../../services/projects.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent {
  @Input() project!: Project;
  @Input() widgets!: Widget[];

  @Output() projectUpdate = new EventEmitter<Project>();

  constructor(private modal: NzModalService, private _projectService: ProjectsService) {
  }

  get progress() {
    return Math.round((this.project.tasksCompleted / this.project.tasksTotal) * 100);
  }

  editProject(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Редактировать проект',
      nzContent: ProjectModalComponent,
      nzFooter: null,
      nzData: { project: { ...this.project } }
    });

    modalRef.afterClose.subscribe((result: Project | null) => {
      if (result) {
        this.projectUpdate.emit(result);
      }
    });
  }

  removeProject(index: number): void {
    this.modal.confirm({
      nzTitle: 'Вы уверены, что хотите удалить этот проект?',
      nzContent: 'Это действие необратимо.',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this._projectService.removeProject(this.project.id);
      },
      nzOnCancel: () => {
        console.log('Удаление отменено');
      }
    });
  }
}
