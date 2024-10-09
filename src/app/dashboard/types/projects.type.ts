export interface Project {
  id: number;
  name: string;
  tasksCompleted: number;
  tasksTotal: number;
  startDate: Date;
  endDate: Date;
  sortOrder?: number;
  widgetId?: number;
}

