import { EventInterface } from 'interfaces/event';
import { TeamInterface } from 'interfaces/team';
import { VendorInterface } from 'interfaces/vendor';
import { UserInterface } from 'interfaces/user';

export interface EventPlanningCompanyInterface {
  id?: string;
  name: string;
  user_id: string;
  event?: EventInterface[];
  team?: TeamInterface[];
  vendor?: VendorInterface[];
  user?: UserInterface;
  _count?: {
    event?: number;
    team?: number;
    vendor?: number;
  };
}
