import { EventInterface } from 'interfaces/event';
import { VendorInterface } from 'interfaces/vendor';

export interface EventVendorInterface {
  id?: string;
  event_id: string;
  vendor_id: string;

  event?: EventInterface;
  vendor?: VendorInterface;
  _count?: {};
}
