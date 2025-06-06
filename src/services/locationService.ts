import type { FormFieldOption } from '../types';
import apiClient from '../config/axios';

interface StatesApiResponse {
  country?: string;
  states: string[];
}

const DEFAULT_COUNTRY = 'USA';

export const getDynamicOptions = async (
  endpoint: string,
  dependencyKey: string,
  dependencyValue: string | number | null
): Promise<FormFieldOption[]> => {
  try {
    const params = new URLSearchParams();
    const valueToSend = dependencyValue || DEFAULT_COUNTRY;

    params.append(dependencyKey, String(valueToSend));

    const url = `${endpoint}?${params.toString()}`;
    const { data } = await apiClient.get<StatesApiResponse>(url);

    if (data && Array.isArray(data.states)) {
      const formattedOptions: FormFieldOption[] = data.states.map((stateName) => ({
        label: stateName,
        value: stateName,
      }));
      return formattedOptions;
    }

    return [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to fetch dynamic options from ${endpoint}:`, error.message);
    } else {
      console.error(`Failed to fetch dynamic options from ${endpoint}:`, error);
    }
    return [];
  }
};
