import * as yup from 'yup';

export const eventScheduleValidationSchema = yup.object().shape({
  start_time: yup.date().required(),
  end_time: yup.date().required(),
  description: yup.string().required(),
  event_id: yup.string().nullable().required(),
});
