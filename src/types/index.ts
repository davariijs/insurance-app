export type FieldType = 'text' | 'select' | 'checkbox' | 'radio' | 'date' | 'number' | 'group';
export interface FormFieldOption { value: string | number; label: string; }
export type ConditionValue = string | number | boolean;
export interface FieldVisibility { dependsOn: string; condition: 'equals'; value: ConditionValue; }
export interface FieldValidation { min?: number; max?: number; pattern?: string; }
export interface DynamicOptions { dependsOn: string; endpoint: string; method: 'GET' | 'POST'; }
export type DefaultFieldValue = string | number | boolean | (string | number)[];
export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  defaultValue?: DefaultFieldValue;
  options?: (string | FormFieldOption)[];
  visibility?: FieldVisibility;
  validation?: FieldValidation;
  dynamicOptions?: DynamicOptions;
  fields?: FormField[];
}
export interface FormStructure { formId: string; title: string; fields: FormField[]; }
export type FormStructureResponse = FormStructure[];

export type SubmissionData = {
  "Full Name": string;
  "Age": number;
  "Gender": 'Male' | 'Female' | string;
  "Insurance Type": 'Health' | 'Home' | 'Car' | string;
  "City": string;
};
export interface Submission extends SubmissionData {
  id: string;
}
export interface SubmissionsResponse {
  columns: (keyof SubmissionData)[];
  data: Submission[];
}