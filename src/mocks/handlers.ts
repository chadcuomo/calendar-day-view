import { http, HttpResponse } from "msw";
import { CalendarEvent } from "@/lib/types";

let mockEvents: CalendarEvent[] = [
  {
    id: "1",
    name: "Team Meeting",
    startTime: "9 AM",
    endTime: "10 AM",
  },
];

export const handlers = [
  http.get("https://example.com/events", () => {
    return HttpResponse.json(mockEvents);
  }),

  http.post("https://example.com/events", async ({ request }) => {
    const newEvent = (await request.json()) as Omit<CalendarEvent, "id">;

    const eventWithId: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(),
    };

    mockEvents = [...mockEvents, eventWithId];

    return HttpResponse.json(eventWithId, { status: 201 });
  }),

  http.put("https://example.com/events/:id", async ({ params, request }) => {
    const { id } = params;
    const updatedEvent = (await request.json()) as Omit<CalendarEvent, "id">;

    const eventIndex = mockEvents.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockEvents[eventIndex] = {
      ...updatedEvent,
      id: id as string,
    };

    return HttpResponse.json(mockEvents[eventIndex], { status: 200 });
  }),

  http.delete("https://example.com/events/:id", ({ params }) => {
    const { id } = params;

    const eventIndex = mockEvents.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockEvents = mockEvents.filter((event) => event.id !== id);

    return new HttpResponse(null, { status: 204 });
  }),
];
