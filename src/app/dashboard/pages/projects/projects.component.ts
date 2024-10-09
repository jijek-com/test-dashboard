import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, type OnInit} from '@angular/core';
import {Project} from "../../types/projects.type";
import {ProjectsService} from "../../services/projects.service";
import {Subscription} from "rxjs";
import {NzModalService} from "ng-zorro-antd/modal";
import {ProjectModalComponent} from "../../components/project-modal/project-modal.component";
import {Widget} from "../../types/widgets.type";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  widgets: Widget[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(private modal: NzModalService,
              private _projectService: ProjectsService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
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

    this._projectService.getAllWidgets().subscribe({
      next: (widgets) => {
        this.widgets = widgets;
      },
      error: (err) => {
        console.error('Что-то пошло не так(((:', err);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Добавить программу',
      nzContent: ProjectModalComponent,
      nzFooter: null,
    });

    modalRef.afterClose.subscribe(result => {
      if (result && result.name &&
        result.startDate && result.endDate && result.tasksCompleted
        && result.tasksTotal) this.addProject(result);
    });
  }

  addProject(result: Project): void {
    const newProject: Project = {
      id: Date.now(),
      name: result.name,
      tasksCompleted: result.tasksCompleted,
      tasksTotal: result.tasksTotal,
      startDate: result.startDate,
      endDate: result.endDate,
    };

    this._projectService.addProject(newProject);
    this.cdr.markForCheck();
  }

  onProjectUpdated(updatedProject: Project): void {
    const index = this.projects.findIndex(project => project.id === updatedProject.id);
    if (index !== -1) {
      this.projects[index] = updatedProject;
    } else {
      this.projects.push(updatedProject);
    }
    this._projectService.updateProject(updatedProject);
  }

  drop(event: CdkDragDrop<Project[]>): void {
    const updatedProjects = [...this.projects];
    moveItemInArray(updatedProjects, event.previousIndex, event.currentIndex);

    updatedProjects.forEach((project, index) => {
      project.sortOrder = index + 1;
    });

    this._projectService.updateProjects(updatedProjects);
    this.cdr.markForCheck();
  }

  trackByFn(index: number, item: Project) {
    return item.id;
  }
}
