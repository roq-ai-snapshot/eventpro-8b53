import axios from 'axios';
import queryString from 'query-string';
import { EventVendorInterface } from 'interfaces/event-vendor';
import { GetQueryInterface } from '../../interfaces';

export const getEventVendors = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/event-vendors${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEventVendor = async (eventVendor: EventVendorInterface) => {
  const response = await axios.post('/api/event-vendors', eventVendor);
  return response.data;
};

export const updateEventVendorById = async (id: string, eventVendor: EventVendorInterface) => {
  const response = await axios.put(`/api/event-vendors/${id}`, eventVendor);
  return response.data;
};

export const getEventVendorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/event-vendors/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEventVendorById = async (id: string) => {
  const response = await axios.delete(`/api/event-vendors/${id}`);
  return response.data;
};
