import { hours } from "../../lib/constants";
import { CalendarEvent } from "@/lib/types";
import { getEventColor } from "@/lib/utils";
interface EventOverlayProps {
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  onEventSelected: (event: CalendarEvent | null) => void;
}

export const EventOverlay = ({
  events,
  selectedEvent,
  onEventSelected,
}: EventOverlayProps) => (
  <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
    {events.map((event, eventIndex) => {
      const startIndex = hours.findIndex((h) => h.value === event.startTime);
      const endIndex = hours.findIndex((h) => h.value === event.endTime);
      const isSelected = selectedEvent?.id === event.id;

      if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
        return null;
      }

      // Find overlapping events
      const overlappingEvents = events.filter((e) => {
        if (e.id === event.id) return false;

        const eStartIndex = hours.findIndex((h) => h.value === e.startTime);
        const eEndIndex = hours.findIndex((h) => h.value === e.endTime);

        return (
          (startIndex < eEndIndex && endIndex > eStartIndex) ||
          (eStartIndex < endIndex && eEndIndex > startIndex)
        );
      });

      // Calculate width and position
      const totalOverlapping = overlappingEvents.length + 1;
      const widthPercentage = 100 / totalOverlapping;
      const overlapPosition = overlappingEvents.filter(
        (e) => e.id < event.id
      ).length;

      return (
        <div
          key={event.id}
          className={`absolute rounded-md p-2 overflow-hidden cursor-pointer ${
            isSelected ? "ring-2 ring-white" : ""
          }`}
          style={{
            top: `${startIndex * 48}px`,
            left: `calc(60px + ${overlapPosition * widthPercentage}%)`,
            width: `calc(${widthPercentage}% - 8px)`,
            height: `${(endIndex - startIndex) * 48}px`,
            backgroundColor: getEventColor(eventIndex, isSelected),
            color: "white",
            zIndex: isSelected ? 20 : 10,
            pointerEvents: "auto",
            transform: isSelected ? "scale(1.02)" : "scale(1)",
            transition: "transform 0.2s, background-color 0.2s",
          }}
          onClick={() => onEventSelected(isSelected ? null : event)}
        >
          <p className="font-medium text-sm truncate">{event.name}</p>
          <p className="text-xs truncate">
            {event.startTime} - {event.endTime}
          </p>
        </div>
      );
    })}
  </div>
);
