import * as yup from 'yup';
import { eventValidationSchema } from 'validationSchema/events';
import { teamValidationSchema } from 'validationSchema/teams';
import { vendorValidationSchema } from 'validationSchema/vendors';

export const eventPlanningCompanyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  event: yup.array().of(eventValidationSchema),
  team: yup.array().of(teamValidationSchema),
  vendor: yup.array().of(vendorValidationSchema),
});
