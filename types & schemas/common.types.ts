import { AxiosResponse } from "axios";

export type AxiosApiPagedResponse<T> = AxiosResponse<ApiPagedResponse<T>>;

export interface ApiPagedResponse<T> {
  products: T;
  limit: number;
  skip: number;
  total: number;
}
