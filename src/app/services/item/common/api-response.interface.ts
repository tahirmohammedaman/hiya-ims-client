export interface ApiResponse<T = undefined> {
  message: string;
  data?: T;
  meta?: {
    totalCount?: number;
  }
}