import { EventScheduleInterface } from 'interfaces/event-schedule';
import { EventTeamInterface } from 'interfaces/event-team';
import { EventVendorInterface } from 'interfaces/event-vendor';
import { GuestInterface } from 'interfaces/guest';
import { EventPlanningCompanyInterface } from 'interfaces/event-planning-company';

export interface EventInterface {
  id?: string;
  name: string;
  start_date: Date;
  end_date: Date;
  company_id: string;
  event_schedule?: EventScheduleInterface[];
  event_team?: EventTeamInterface[];
  event_vendor?: EventVendorInterface[];
  guest?: GuestInterface[];
  event_planning_company?: EventPlanningCompanyInterface;
  _count?: {
    event_schedule?: number;
    event_team?: number;
    event_vendor?: number;
    guest?: number;
  };
}
