import { Injectable } from "@angular/core";
import { Project } from "../types/projects.type";
import { BehaviorSubject, Observable } from "rxjs";
import { Widget } from "../types/widgets.type";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private initialProjects: Project[] = [
    {
      id: 1,
      name: "Проект A",
      tasksCompleted: 25,
      tasksTotal: 100,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31")
    },
    {
      id: 2,
      name: "Проект B",
      tasksCompleted: 75,
      tasksTotal: 140,
      startDate: new Date("2023-06-01"),
      endDate: new Date("2024-03-31")
    },
    {
      id: 3,
      name: "Проект C",
      tasksCompleted: 80,
      tasksTotal: 85,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-09-30")
    }
  ];

  private projectsSubject = new BehaviorSubject<Project[]>(this.loadProjectsFromLocalStorage());
  private widgetsSubject = new BehaviorSubject<Widget[]>(this.loadWidgetsFromLocalStorage());

  getAllProjects(): Observable<Project[]> {
    return this.projectsSubject.asObservable();
  }

  getAllWidgets(): Observable<Widget[]> {
    return this.widgetsSubject.asObservable();
  }

  addWidget(widget: Widget): void {
    const currentWidgets = this.widgetsSubject.getValue();

    this.widgetsSubject.next([...currentWidgets, widget]);

    this.saveWidgetsToLocalStorage([...currentWidgets, widget]);
  }

  removeWidget(index: number): void {
    const currentWidgets = this.widgetsSubject.getValue();

    const updatedWidgets = currentWidgets.filter(widget => widget.id !== index);

    updatedWidgets.forEach((widget, index) => {
      widget.sortOrder = index + 1;
    });

    this.widgetsSubject.next(updatedWidgets);

    this.saveWidgetsToLocalStorage(updatedWidgets);
  }

  addProject(project: Project): void {
    const currentProjects = this.projectsSubject.getValue();
    this.projectsSubject.next([...currentProjects, project]);

    this.saveProjectsToLocalStorage([...currentProjects, project]);
  }

  removeProject(projectId: number): void {
    const currentProjects = this.projectsSubject.getValue();
    const updatedProjects = currentProjects.filter(p => p.id !== projectId);

    this.projectsSubject.next(updatedProjects);
    this.saveProjectsToLocalStorage(updatedProjects);
  }

  updateWidgets(widgets: Widget[]): void {
    this.widgetsSubject.next(widgets);
    this.saveWidgetsToLocalStorage(widgets);
  }

  updateWidget(updatedWidget: Widget): void {
    const currentWidgets = this.widgetsSubject.getValue();

    const index = currentWidgets.findIndex(widget => widget.id === updatedWidget.id);

    if (index !== -1) {
      const updatedWidgets = [...currentWidgets];
      updatedWidgets[index] = updatedWidget;

      this.widgetsSubject.next(updatedWidgets);
      this.saveWidgetsToLocalStorage(updatedWidgets);
    }
  }

  updateProject(updateProject: Project): void {
    const currentProjects = this.projectsSubject.getValue();

    const index = currentProjects.findIndex(project => project.id === updateProject.id);

    if (index !== -1) {
      const updateProjects = [...currentProjects];
      updateProjects[index] = updateProject;

      this.projectsSubject.next(updateProjects);
      this.saveProjectsToLocalStorage(updateProjects);
    }
  }

  updateProjects(projects: Project[]): void {
    this.projectsSubject.next(projects);
    this.saveProjectsToLocalStorage(projects);
  }

  private loadWidgetsFromLocalStorage(): Widget[] {
    const savedWidgets = localStorage.getItem('indigo-lab-widgets');
    return savedWidgets ? JSON.parse(savedWidgets) : [];
  }

  private saveWidgetsToLocalStorage(widgets: Widget[]): void {
    localStorage.setItem('indigo-lab-widgets', JSON.stringify(widgets));
  }

  private saveProjectsToLocalStorage(projects: Project[]): void {
    localStorage.setItem('indigo-lab-projects', JSON.stringify(projects));
  }

  private loadProjectsFromLocalStorage(): Project[] {
    const projects = localStorage.getItem('indigo-lab-projects');
    return projects ? JSON.parse(projects) : this.initialProjects;
  }
}
