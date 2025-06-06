import type { FormStructureResponse } from '../types';
import apiClient from '../config/axios';
import type { FieldValues } from 'react-hook-form';

export interface SubmitFormResponse {
  success: boolean;
  message: string;
  submissionId: string;
}

export const getAllForms = async (): Promise<FormStructureResponse> => {
  const { data } = await apiClient.get<FormStructureResponse>('/api/insurance/forms');
  return data;
};

export const submitForm = async (
  formData: FieldValues,
  formId: string
): Promise<SubmitFormResponse> => {
  const payload = { formId, ...formData };
  const { data } = await apiClient.post<SubmitFormResponse>('/api/insurance/forms/submit', payload);
  return data;
};
