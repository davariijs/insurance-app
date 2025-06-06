import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { ThemeProvider } from '../context/ThemeProvider';
import InsuranceFormPage from './InsuranceFormPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AntdApp>
            <InsuranceFormPage />
          </AntdApp>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('InsuranceFormPage', () => {
  afterEach(() => {
    queryClient.clear();
  });

  it('should display and hide conditional fields correctly', async () => {
    renderComponent();
    const user = userEvent.setup();

    const formSelector = await screen.findByRole('combobox');

    await user.click(formSelector);
    const healthOption = await screen.findByText('Health Insurance Application');
    await user.click(healthOption);

    await waitFor(() => {
      expect(screen.queryByText('How often do you smoke?')).not.toBeInTheDocument();
    });

    const yesRadio = await screen.findByLabelText('Yes');
    await user.click(yesRadio);

    const smokingFrequencyField = await screen.findByText('How often do you smoke?');
    expect(smokingFrequencyField).toBeInTheDocument();

    const noRadio = screen.getByLabelText('No');
    await user.click(noRadio);

    await waitFor(() => {
      expect(screen.queryByText('How often do you smoke?')).not.toBeInTheDocument();
    });
  });

  it('should show an error message if a required field is empty on submit', async () => {
    renderComponent();
    const user = userEvent.setup();

    const formSelector = await screen.findByRole('combobox');
    await user.click(formSelector);
    await user.click(await screen.findByText('Health Insurance Application'));

    const submitButton = await screen.findByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    const errorMessage = await screen.findByText('First Name is required.');
    expect(errorMessage).toBeInTheDocument();
  });
});
