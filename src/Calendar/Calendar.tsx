import { CalendarEvent } from "@/lib/types";
import { Header } from "../components/Header";
import { CalendarGrid } from "./components/CalendarGrid";
import { useState } from "react";

export const Calendar = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  const handleEventSelected = (event: CalendarEvent | null) => {
    setSelectedEvent(event);
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <Header
        selectedEvent={selectedEvent}
        onEventSelected={handleEventSelected}
      />
      <CalendarGrid
        selectedEvent={selectedEvent}
        onEventSelected={handleEventSelected}
      />
    </div>
  );
};
