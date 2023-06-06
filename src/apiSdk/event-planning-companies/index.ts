import axios from 'axios';
import queryString from 'query-string';
import { EventPlanningCompanyInterface } from 'interfaces/event-planning-company';
import { GetQueryInterface } from '../../interfaces';

export const getEventPlanningCompanies = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/event-planning-companies${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEventPlanningCompany = async (eventPlanningCompany: EventPlanningCompanyInterface) => {
  const response = await axios.post('/api/event-planning-companies', eventPlanningCompany);
  return response.data;
};

export const updateEventPlanningCompanyById = async (
  id: string,
  eventPlanningCompany: EventPlanningCompanyInterface,
) => {
  const response = await axios.put(`/api/event-planning-companies/${id}`, eventPlanningCompany);
  return response.data;
};

export const getEventPlanningCompanyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/event-planning-companies/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteEventPlanningCompanyById = async (id: string) => {
  const response = await axios.delete(`/api/event-planning-companies/${id}`);
  return response.data;
};
