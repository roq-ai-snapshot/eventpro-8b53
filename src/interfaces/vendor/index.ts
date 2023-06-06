import { EventVendorInterface } from 'interfaces/event-vendor';
import { EventPlanningCompanyInterface } from 'interfaces/event-planning-company';

export interface VendorInterface {
  id?: string;
  name: string;
  contact_email: string;
  company_id: string;
  event_vendor?: EventVendorInterface[];
  event_planning_company?: EventPlanningCompanyInterface;
  _count?: {
    event_vendor?: number;
  };
}
