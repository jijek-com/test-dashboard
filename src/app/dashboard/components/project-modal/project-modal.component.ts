import {ChangeDetectionStrategy, Component, OnDestroy, type OnInit} from '@angular/core';
import {Widget} from "../../types/widgets.type";
import {Project} from "../../types/projects.type";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ProjectsService} from "../../services/projects.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectModalComponent implements OnInit, OnDestroy {
  widgets!: Widget[];
  project!: Project;

  private projectSubscription!: Subscription;

  constructor(private modalRef: NzModalRef,
              private _projectsService: ProjectsService) {
  }

  ngOnInit(): void {
    this.project = this.modalRef.getConfig()?.nzData?.project;

    if (!this.project) {
      this.project = {
        id: new Date().getTime(),
        name: '',
        tasksCompleted: 0,
        tasksTotal: 0,
        startDate: new Date(),
        endDate: new Date(),
      };
    }

    this.projectSubscription = this._projectsService.getAllWidgets().subscribe({
      next: (widgets) => {
        this.widgets = widgets;
      },
      error: (err) => {
        console.error('Ошибка при получении Виджетов:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.projectSubscription.unsubscribe();
  }

  handleSave(): void {
    this.modalRef.close(this.project);
  }

  handleCancel(): void {
    this.modalRef.close(null);
  }
}
