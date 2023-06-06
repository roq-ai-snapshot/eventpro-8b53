import * as yup from 'yup';

export const eventTeamValidationSchema = yup.object().shape({
  event_id: yup.string().nullable().required(),
  team_id: yup.string().nullable().required(),
});
