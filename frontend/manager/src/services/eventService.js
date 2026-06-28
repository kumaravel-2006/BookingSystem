import { eventApi } from './api';

export const eventService = {
  getEvents: async () => {
    const res = await eventApi.get('/events');
    return res.data;
  },
  getEventById: async (id) => {
    const res = await eventApi.get(`/events/${id}`);
    return res.data;
  },
  createEvent: async (eventData) => {
    const res = await eventApi.post('/events', eventData);
    return res.data;
  },
  updateEvent: async (id, eventData) => {
    const res = await eventApi.put(`/events/${id}`, eventData);
    return res.data;
  },
  deleteEvent: async (id) => {
    const res = await eventApi.delete(`/events/${id}`);
    return res.data;
  },
  getVenues: async () => {
    const res = await eventApi.get('/venues');
    return res.data;
  },
  createVenue: async (venueData) => {
    const res = await eventApi.post('/venues', venueData);
    return res.data;
  },
  getSeatsByEventId: async (id) => {
    const res = await eventApi.get(`/events/${id}/seats`);
    return res.data;
  },
  createSeats: async (id, seatDTOs) => {
    const res = await eventApi.post(`/events/${id}/seats`, seatDTOs);
    return res.data;
  }
};
