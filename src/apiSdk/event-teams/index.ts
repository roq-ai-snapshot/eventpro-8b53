import axios from 'axios';
import queryString from 'query-string';
import { EventTeamInterface } from 'interfaces/event-team';
import { GetQueryInterface } from '../../interfaces';

export const getEventTeams = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/event-teams${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEventTeam = async (eventTeam: EventTeamInterface) => {
  const response = await axios.post('/api/event-teams', eventTeam);
  return response.data;
};

export const updateEventTeamById = async (id: string, eventTeam: EventTeamInterface) => {
  const response = await axios.put(`/api/event-teams/${id}`, eventTeam);
  return response.data;
};

export const getEventTeamById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/event-teams/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEventTeamById = async (id: string) => {
  const response = await axios.delete(`/api/event-teams/${id}`);
  return response.data;
};
