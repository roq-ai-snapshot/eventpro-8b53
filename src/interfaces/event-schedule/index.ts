import { EventInterface } from 'interfaces/event';

export interface EventScheduleInterface {
  id?: string;
  start_time: Date;
  end_time: Date;
  description: string;
  event_id: string;

  event?: EventInterface;
  _count?: {};
}
