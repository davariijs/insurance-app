import * as z from 'zod';
import type { FormField } from '../types';
import type { TFunction } from 'i18next';

type ZodShape = z.ZodRawShape;

const buildRecursiveSchema = (fields: FormField[], t: TFunction): z.ZodType => {
  const shape: ZodShape = {};

  fields.forEach((field) => {
    let validator: z.ZodType;

    switch (field.type) {
      case 'group': {
        if (field.fields && field.fields.length > 0) {
          validator = buildRecursiveSchema(field.fields, t);
        } else {
          validator = z.object({});
        }
        break;
      }
        
      case 'text':
      case 'select':
      case 'radio':
      case 'date': {
        validator = z.string().optional().nullable();
        break;
      }

      case 'number': {
        validator = z.coerce.number().optional().nullable();
        break;
      }

      case 'checkbox': {
        if (Array.isArray(field.options) && field.options.length > 0) {
          validator = z.array(z.string()).optional(); 
        } else {
          validator = z.boolean().optional(); 
        }
        break;
      }
      
      default: {
        const _exhaustiveCheck: never = field.type;
        return _exhaustiveCheck;
      }
    }
    shape[field.id] = validator;
  });

  return z.object(shape).superRefine((data, ctx) => {
    
    fields.forEach(field => {
      if (field.type === 'group') return;

      let isVisible = true;
      if (field.visibility) {
        const dependentValue = data[field.visibility.dependsOn];
        if (dependentValue !== field.visibility.value) {
          isVisible = false;
        }
      }

      if (isVisible && field.required) {
        const value = data[field.id];
        const requiredError = t('form.required_field', { field: field.label });

        let isValid = true;
        if (value === null || value === undefined || value === '') {
          isValid = false;
        } else if (Array.isArray(value) && value.length === 0) {
          isValid = false;
        } else if (field.type === 'checkbox' && !Array.isArray(field.options) && value !== true) {
          isValid = false;
        }

        if (!isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: requiredError,
            path: [field.id],
          });
        }
        
        if (isValid && field.validation) {
            if (field.type === 'number' && typeof value === 'number') {
                if (field.validation.min !== undefined && value < field.validation.min) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Minimum value is ${field.validation.min}`, path: [field.id]});
                }
                if (field.validation.max !== undefined && value > field.validation.max) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Maximum value is ${field.validation.max}`, path: [field.id]});
                }
            }
            if (field.type === 'text' && typeof value === 'string' && field.validation.pattern) {
                if (!new RegExp(field.validation.pattern).test(value)) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Invalid format`, path: [field.id]});
                }
            }
        }
      }
    });
  });
};

export const createFormSchema = (fields: FormField[], t: TFunction): z.ZodType => {
  if (!fields || fields.length === 0) {
    return z.object({});
  }
  return buildRecursiveSchema(fields, t);
};