import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = ({ taskList }) => {
  const events = taskList.map((task) => ({
    title: task.title,
    date: task.date,
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default Calendar;
