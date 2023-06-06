import * as yup from 'yup';
import { eventVendorValidationSchema } from 'validationSchema/event-vendors';

export const vendorValidationSchema = yup.object().shape({
  name: yup.string().required(),
  contact_email: yup.string().required(),
  company_id: yup.string().nullable().required(),
  event_vendor: yup.array().of(eventVendorValidationSchema),
});
