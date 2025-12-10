export interface DashboardItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  count?: number;
}