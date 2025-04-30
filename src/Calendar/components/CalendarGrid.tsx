import { useQuery } from "@tanstack/react-query";
import { hours } from "../../lib/constants";
import { EventOverlay } from "./EventOverlay";
import { CalendarEvent } from "@/lib/types";
import { getEvents } from "../calendar.queries";
import { toast } from "sonner";
import { useEffect } from "react";

interface CalendarGridProps {
  selectedEvent: CalendarEvent | null;
  onEventSelected: (event: CalendarEvent | null) => void;
}

export const CalendarGrid = ({
  selectedEvent,
  onEventSelected,
}: CalendarGridProps) => {
  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong");
    }
  }, [isError]);

  return (
    <div className="mt-4">
      {isLoading && <div className="text-center py-4">Loading events...</div>}
      <div className="border border-gray-200 rounded-lg">
        <div
          className="relative"
          style={{ minHeight: `${hours.length * 48}px` }}
        >
          {hours.map((hour) => (
            <div key={hour.id} className="relative" style={{ height: "48px" }}>
              <div className="absolute top-0 left-[60px] right-0 border-t border-gray-200"></div>
              <div className="absolute top-[-10px] left-0 w-[60px] text-right pr-2 bg-white border-r border-gray-100">
                <span className="text-sm text-gray-500">{hour.value}</span>
              </div>
              <div className="absolute top-0 bottom-0 left-[60px] border-r border-gray-200"></div>
            </div>
          ))}
          <EventOverlay
            events={events}
            selectedEvent={selectedEvent}
            onEventSelected={onEventSelected}
          />
        </div>
      </div>
    </div>
  );
};
