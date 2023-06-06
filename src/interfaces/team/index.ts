import { EventTeamInterface } from 'interfaces/event-team';
import { TeamMemberInterface } from 'interfaces/team-member';
import { EventPlanningCompanyInterface } from 'interfaces/event-planning-company';

export interface TeamInterface {
  id?: string;
  name: string;
  company_id: string;
  event_team?: EventTeamInterface[];
  team_member?: TeamMemberInterface[];
  event_planning_company?: EventPlanningCompanyInterface;
  _count?: {
    event_team?: number;
    team_member?: number;
  };
}
