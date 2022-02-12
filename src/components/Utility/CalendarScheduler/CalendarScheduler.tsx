import React from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";

const CalendarScheduler = () => {
  const handleDateClick = (arg) => {
    // bind with an arrow function
    alert(arg.dateStr);
  };
  const calendarRef = React.useRef<any>();

  if (
    calendarRef.current &&
    typeof calendarRef.current.updateSize === "function"
  ) {
    calendarRef.current.updateSize();
  }
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      dateClick={handleDateClick}
      events={[
        { title: "event 1", date: "2022-02-11" },
        { title: "event 2", date: "2022-02-12" },
      ]}
      initialView="dayGridMonth"
      ref={calendarRef}
    />
  );
};

export default CalendarScheduler;
