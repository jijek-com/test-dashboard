export interface Widget {
  id: number;
  name: string;
  type: 'normal' | 'circular';
  size: 'small' | 'medium' | 'large';
  sortOrder: number;
  projectId?: number;
}
