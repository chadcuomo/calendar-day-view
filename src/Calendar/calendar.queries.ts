import { CalendarEvent } from "@/lib/types";
import axios from "axios";

const API_URL = "https://example.com";

export async function getEvents() {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function createEvent(newEvent: Omit<CalendarEvent, "id">) {
  try {
    const response = await axios.post(`${API_URL}/events`, newEvent);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await axios.delete(`${API_URL}/events/${eventId}`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

export async function updateEvent(
  eventId: string,
  eventData: Omit<CalendarEvent, "id">
) {
  try {
    const response = await axios.put(`${API_URL}/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}
