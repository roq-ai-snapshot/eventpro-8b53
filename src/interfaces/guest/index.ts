import { EventInterface } from 'interfaces/event';

export interface GuestInterface {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  event_id: string;

  event?: EventInterface;
  _count?: {};
}
