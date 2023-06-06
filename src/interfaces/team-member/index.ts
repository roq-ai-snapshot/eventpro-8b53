import { UserInterface } from 'interfaces/user';
import { TeamInterface } from 'interfaces/team';

export interface TeamMemberInterface {
  id?: string;
  user_id: string;
  team_id: string;

  user?: UserInterface;
  team?: TeamInterface;
  _count?: {};
}
