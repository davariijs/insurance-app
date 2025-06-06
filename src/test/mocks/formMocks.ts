import { type FormStructure } from '../../types';

export const healthInsuranceFormMock: FormStructure = {
  formId: 'health_insurance_application',
  title: 'Health Insurance Application',
  fields: [
    {
      id: 'personal_info',
      label: 'Personal Information',
      type: 'group',
      fields: [
        { id: 'first_name', label: 'First Name', type: 'text', required: true, validation: {} },
      ],
    },
    {
      id: 'health_info',
      label: 'Health Information',
      type: 'group',
      fields: [
        {
          id: 'smoker',
          label: 'Do you smoke?',
          type: 'radio',
          options: ['Yes', 'No'],
          required: true,
          validation: {},
        },
        {
          id: 'smoking_frequency',
          label: 'How often do you smoke?',
          type: 'select',
          options: ['Occasionally', 'Daily', 'Heavy'],
          required: true,
          validation: {},
          visibility: { dependsOn: 'smoker', condition: 'equals', value: 'Yes' },
        },
      ],
    },
  ],
};
