import axios from 'axios';
import queryString from 'query-string';
import { EventScheduleInterface } from 'interfaces/event-schedule';
import { GetQueryInterface } from '../../interfaces';

export const getEventSchedules = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/event-schedules${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEventSchedule = async (eventSchedule: EventScheduleInterface) => {
  const response = await axios.post('/api/event-schedules', eventSchedule);
  return response.data;
};

export const updateEventScheduleById = async (id: string, eventSchedule: EventScheduleInterface) => {
  const response = await axios.put(`/api/event-schedules/${id}`, eventSchedule);
  return response.data;
};

export const getEventScheduleById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/event-schedules/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEventScheduleById = async (id: string) => {
  const response = await axios.delete(`/api/event-schedules/${id}`);
  return response.data;
};
