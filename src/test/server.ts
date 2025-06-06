import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { healthInsuranceFormMock } from './mocks/formMocks';

export const handlers = [
  http.get('https://assignment.devotel.io/api/insurance/forms', () => {
    return HttpResponse.json([healthInsuranceFormMock]);
  }),
  http.post('https://assignment.devotel.io/api/insurance/forms/submit', () => {
    return HttpResponse.json({ success: true, submissionId: 'test-123' });
  }),
];

export const server = setupServer(...handlers);
