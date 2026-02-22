import { useState } from "react";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function WorkCalendar({ onDateSelect }) {

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleClick = (day) => {
    const formattedDate = `${String(day).padStart(2, "0")}-${String(
      month + 1
    ).padStart(2, "0")}-${year}`;

    console.log("Clicked date:", formattedDate);

    onDateSelect(formattedDate); 
  };

    const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="bg-white p-2 mt-3 mt-md-2 p-lg-4 rounded-xl shadow">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth}>
          <i className="bi bi-caret-left-fill"></i>
        </button>

        <h6 className="font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h6>

        <button onClick={nextMonth}>
          <i className="bi bi-caret-right-fill"></i>
        </button>
      </div>

      {/* WEEK DAYS */}
      <div className="grid grid-cols-7 text-center text-gray-500">
        {WEEK_DAYS.map((day) => (
          <h6 className="p-2" key={day}>{day}</h6>
        ))}
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 mt-2">

        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={i}></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;

          return (
            <div
              key={day}
              onClick={() => handleClick(day)}
              className={`h-10 flex items-center fw-semibold justify-center rounded-pill cursor-pointer
                ${isToday(day)
                  ? "bg-cyan-500 text-white font-bold "   
                  : "hover:bg-gray-200"
                }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
