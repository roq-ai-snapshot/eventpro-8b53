import { EventInterface } from 'interfaces/event';
import { TeamInterface } from 'interfaces/team';

export interface EventTeamInterface {
  id?: string;
  event_id: string;
  team_id: string;

  event?: EventInterface;
  team?: TeamInterface;
  _count?: {};
}
