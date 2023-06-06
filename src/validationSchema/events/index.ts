import * as yup from 'yup';
import { eventScheduleValidationSchema } from 'validationSchema/event-schedules';
import { eventTeamValidationSchema } from 'validationSchema/event-teams';
import { eventVendorValidationSchema } from 'validationSchema/event-vendors';
import { guestValidationSchema } from 'validationSchema/guests';

export const eventValidationSchema = yup.object().shape({
  name: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  company_id: yup.string().nullable().required(),
  event_schedule: yup.array().of(eventScheduleValidationSchema),
  event_team: yup.array().of(eventTeamValidationSchema),
  event_vendor: yup.array().of(eventVendorValidationSchema),
  guest: yup.array().of(guestValidationSchema),
});
