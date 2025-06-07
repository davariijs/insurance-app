import { renderHook, act, waitFor } from '@testing-library/react';
import { useSubmissions } from './useSubmissions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSubmissions } from '../services/submissionService';
import { type SubmissionsResponse } from '../types';
import { vi } from 'vitest';

vi.mock('../services/submissionService');

const mockData: SubmissionsResponse = {
  columns: ['Full Name', 'City'],
  data: [
    {
      id: '1',
      'Full Name': 'John Doe',
      City: 'New York',
      Age: 28,
      Gender: 'Male',
      'Insurance Type': 'Health',
    },
    {
      id: '2',
      'Full Name': 'Jane Smith',
      City: 'Los Angeles',
      Age: 32,
      Gender: 'Female',
      'Insurance Type': 'Home',
    },
  ],
};

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useSubmissions hook', () => {
  beforeEach(() => {
    vi.mocked(getSubmissions).mockResolvedValue(mockData);
  });

  it('should filter data based on search text', async () => {
    const { result } = renderHook(() => useSubmissions(), { wrapper });

    await waitFor(() => expect(result.current.submissionsData.length).toBe(2));

    act(() => {
      result.current.setSearchText('John');
    });

    expect(result.current.submissionsData.length).toBe(1);
    expect(result.current.submissionsData[0]['Full Name']).toBe('John Doe');

    act(() => {
      result.current.setSearchText('invalid-search');
    });
    expect(result.current.submissionsData.length).toBe(0);
  });
});
