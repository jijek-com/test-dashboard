import {ChangeDetectionStrategy, Component, OnDestroy, type OnInit} from '@angular/core';
import {Widget} from "../../types/widgets.type";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ProjectsService} from "../../services/projects.service";
import {Project} from "../../types/projects.type";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-widget-modal',
  templateUrl: './widget-modal.component.html',
  styleUrls: ['./widget-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetModalComponent implements OnInit, OnDestroy {
  widget!: Widget;
  projects: Project[] = [];

  private projectSubscription!: Subscription;

  constructor(private modalRef: NzModalRef,
              private projectsService: ProjectsService) {
  }

  ngOnInit(): void {
    this.widget = this.modalRef.getConfig()?.nzData?.widget;

    if (!this.widget) {
      this.widget = {
        id: new Date().getTime(),
        name: '',
        type: 'normal',
        sortOrder: 0,
        size: 'medium'
      };
    }

    this.projectSubscription = this.projectsService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => {
        console.error('Ошибка при получении проектов:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.projectSubscription.unsubscribe();
  }

  handleSave(): void {
    this.modalRef.close(this.widget);
  }


  handleCancel(): void {
    this.modalRef.close(null);
  }
}
