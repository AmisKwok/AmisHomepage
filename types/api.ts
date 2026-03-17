export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  path: string;
  filename: string;
}

export interface MusicListResponse {
  success: boolean;
  music: Array<{
    id: string;
    name: string;
    path: string;
    order: number;
  }>;
}
