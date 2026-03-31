import api from './axios.js';

export const getMyTrips = () => api.get('/trips');
export const createTrip = (data) => api.post('/trips', data);
export const getTrip = (id) => api.get(`/trips/${id}`);
export const deleteTrip = (id) => api.delete(`/trips/${id}`);
export const joinTrip = (inviteCode) => api.post('/trips/join', { inviteCode });
export const getTripMembers = (id) => api.get(`/trips/${id}/members`);

// Expenses
export const getTripExpenses = (id) => api.get(`/trips/${id}/expenses`);
export const createExpense = (id, data) => api.post(`/trips/${id}/expenses`, data);
export const deleteExpense = (id, expId) => api.delete(`/trips/${id}/expenses/${expId}`);
export const settleSplit = (id, expId) => api.patch(`/trips/${id}/expenses/${expId}/settle`);
export const getSettlement = (id) => api.get(`/trips/${id}/expenses/settlement`);

// Votes
export const getVotes = (id) => api.get(`/trips/${id}/votes`);
export const createVote = (id, data) => api.post(`/trips/${id}/votes`, data);
export const castVote = (id, voteId) => api.post(`/trips/${id}/votes/${voteId}/vote`);
export const deleteVote = (id, voteId) => api.delete(`/trips/${id}/votes/${voteId}`);

// Itinerary
export const getItinerary = (id) => api.get(`/trips/${id}/itinerary`);
export const createItineraryItem = (id, data) => api.post(`/trips/${id}/itinerary`, data);
export const updateItineraryItem = (id, itemId, data) => api.patch(`/trips/${id}/itinerary/${itemId}`, data);
export const deleteItineraryItem = (id, itemId) => api.delete(`/trips/${id}/itinerary/${itemId}`);
export const reorderItinerary = (id, items) => api.patch(`/trips/${id}/itinerary/reorder`, { items });

// Packing
export const getPackingList = (id) => api.get(`/trips/${id}/packing`);
export const createPackingItem = (id, data) => api.post(`/trips/${id}/packing`, data);
export const togglePackingItem = (id, itemId) => api.patch(`/trips/${id}/packing/${itemId}/toggle`);
export const deletePackingItem = (id, itemId) => api.delete(`/trips/${id}/packing/${itemId}`);
