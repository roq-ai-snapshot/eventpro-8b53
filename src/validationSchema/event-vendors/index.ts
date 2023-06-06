import * as yup from 'yup';

export const eventVendorValidationSchema = yup.object().shape({
  event_id: yup.string().nullable().required(),
  vendor_id: yup.string().nullable().required(),
});
