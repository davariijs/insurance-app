import * as z from 'zod';
import type  { FormField } from '../types';
import type { TFunction } from 'i18next';

type ZodShape = z.ZodRawShape;

const buildShape = (fields: FormField[], t: TFunction): ZodShape => {
  const shape: ZodShape = {};

  fields.forEach((field) => {
    let validator: z.ZodType; 

    const requiredError = t('form.required_field', { field: field.label });

    switch (field.type) {
      case 'group': {
        if (field.fields) {
          validator = z.object(buildShape(field.fields, t));
        } else {
          validator = z.object({});
        }
        break;
      }

      case 'text':
      case 'select':
      case 'radio': {
        let stringValidator = z.string({ required_error: requiredError });
        if (field.required) {
          stringValidator = stringValidator.min(1, requiredError);
        }
        if (field.validation?.pattern) {
          stringValidator = stringValidator.regex(new RegExp(field.validation.pattern), {
            message: `Invalid format for ${field.label}`,
          });
        }
        validator = stringValidator;
        break;
      }

      case 'date': {
        const dateValidator = z.coerce.date({
          required_error: requiredError,
          invalid_type_error: `Invalid date for ${field.label}`,
        });
        if (field.required) {
          validator = dateValidator;
        } else {
          validator = dateValidator.optional().nullable();
        }
        break;
      }
      
      case 'number': {
        let numberValidator = z.coerce.number({
          required_error: requiredError,
          invalid_type_error: t('form.invalid_number', { field: field.label }),
        });
        if (field.validation?.min !== undefined) {
          numberValidator = numberValidator.min(field.validation.min, `Value must be at least ${field.validation.min}`);
        }
        if (field.validation?.max !== undefined) {
          numberValidator = numberValidator.max(field.validation.max, `Value must be at most ${field.validation.max}`);
        }
        validator = numberValidator;
        break;
      }

      case 'checkbox': {
        if (Array.isArray(field.options) && field.options.length > 0) {
          const arrayValidator = z.array(z.string());
          validator = field.required 
            ? arrayValidator.nonempty({ message: requiredError }) 
            : arrayValidator;
        } else {
          const booleanValidator = z.boolean();
          validator = field.required
            ? booleanValidator.refine(val => val === true, { message: requiredError })
            : booleanValidator;
        }
        break;
      }

      default: {
        const _exhaustiveCheck: never = field.type;
        return _exhaustiveCheck;
      }
    }

    if (!field.required && field.type !== 'date' && field.type !== 'checkbox') {
        validator = validator.optional();
    }
    
    if (!field.required && (field.type === 'text' || field.type === 'select' || field.type === 'radio')) {
        validator = validator.or(z.literal(''));
    }

    shape[field.id] = validator;
  });

  return shape;
};


export const createFormSchema = (fields: FormField[], t: TFunction): z.ZodObject<ZodShape> => {
  if (!fields || fields.length === 0) {
    return z.object({});
  }
  const shape = buildShape(fields, t);
  return z.object(shape);
};