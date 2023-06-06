import * as yup from 'yup';
import { eventTeamValidationSchema } from 'validationSchema/event-teams';
import { teamMemberValidationSchema } from 'validationSchema/team-members';

export const teamValidationSchema = yup.object().shape({
  name: yup.string().required(),
  company_id: yup.string().nullable().required(),
  event_team: yup.array().of(eventTeamValidationSchema),
  team_member: yup.array().of(teamMemberValidationSchema),
});
