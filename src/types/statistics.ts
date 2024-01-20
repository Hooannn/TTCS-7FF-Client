export interface IStatistics {
  currentCount: number;
  previousCount: number;
  unit?: string;
  details?: { name: string; value: number }[];
  createdAt?: string;
}
