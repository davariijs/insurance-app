import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubmissionsListPage from './SubmissionsListPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { getSubmissions } from '../services/submissionService';
import { BrowserRouter } from 'react-router-dom';
import { type SubmissionsResponse } from '../types';

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

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SubmissionsListPage />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('SubmissionsListPage', () => {
  beforeEach(() => {
    vi.mocked(getSubmissions).mockResolvedValue(mockData);
  });

  it('should filter the table when user types in the search box', async () => {
    renderComponent();

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search in table...');

    await userEvent.type(searchInput, 'John');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });
});
