import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, type OnInit} from '@angular/core';
import {Widget} from "../../types/widgets.type";
import {NzModalService} from "ng-zorro-antd/modal";
import {WidgetModalComponent} from "../../components/widget-modal/widget-modal.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ProjectsService} from "../../services/projects.service";
import {Subscription} from "rxjs";
import {Project} from "../../types/projects.type";

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetsComponent implements OnInit, OnDestroy {
  widgets: Widget[] = [];
  projects: Project[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(private modal: NzModalService,
              private _projectService: ProjectsService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.subscriptions.add(
      this._projectService.getAllWidgets().subscribe({
        next: (widgets) => {
          this.widgets = widgets;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Что-то пошло не так(((:', err);
        }
      })
    );

    this.subscriptions.add(
      this._projectService.getAllProjects().subscribe({
        next: (projects) => {
          this.projects = projects;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Что-то пошло не так(((:', err);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Добавить виджет',
      nzContent: WidgetModalComponent,
      nzFooter: null,
    });

    modalRef.afterClose.subscribe(result => {
      if (result && result.name && result.type && result.size) this.addWidget(result);
    });
  }

  addWidget(result: Widget): void {
    const newWidget: Widget = {
      id: Date.now(),
      type: result.type,
      name: result.name,
      size: result.size,
      sortOrder: this.widgets.length + 1,
      projectId: result.projectId,
    };

    this._projectService.addWidget(newWidget);
    this.cdr.markForCheck();
  }

  onWidgetUpdated(updatedWidget: Widget): void {
    const index = this.widgets.findIndex(widget => widget.id === updatedWidget.id);
    if (index !== -1) {
      this.widgets[index] = updatedWidget;
    } else {
      this.widgets.push(updatedWidget);
    }
    this._projectService.updateWidget(updatedWidget);
  }

  getProjectById(projectId?: number): Project | undefined {
    return this.projects.find(project => project.id === projectId);
  }

  drop(event: CdkDragDrop<Widget[]>): void {
    const updatedWidgets = [...this.widgets];
    moveItemInArray(updatedWidgets, event.previousIndex, event.currentIndex);

    updatedWidgets.forEach((widget, index) => {
      widget.sortOrder = index + 1;
    });

    this._projectService.updateWidgets(updatedWidgets);
    this.cdr.markForCheck();
  }

  trackByFn(index: number, item: Widget): number {
    return item.id;
  }
}
