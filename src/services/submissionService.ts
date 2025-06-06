import type { SubmissionsResponse } from '../types';
import apiClient from '../config/axios';

export const getSubmissions = async (): Promise<SubmissionsResponse> => {
  const { data } = await apiClient.get<SubmissionsResponse>('/api/insurance/forms/submissions');
  return data;
};
