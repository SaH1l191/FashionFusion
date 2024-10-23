import React from 'react';
import { format, parseISO } from 'date-fns';

const CustomTooltip = ({ active, payload, label, timespan }) => {
  if (active && payload && payload.length) {
    let formattedTime;
    const date = parseISO(label);

    switch (timespan) {
      case 'last_hour':
        formattedTime = format(date, "MMM d, yyyy 'at' h:mm:ss a");
        break;
      case 'last_day':
        formattedTime = format(date, "MMM d, yyyy 'at' h:mm a");
        break;
      case 'last_week':
        formattedTime = format(date, "EEE, MMM d, yyyy 'at' h:mm a");
        break;
      case 'last_month':
        formattedTime = format(date, "MMM d, yyyy 'at' h:mm a");
        break;
      case 'last_3_months':
        formattedTime = format(date, "MMM d, yyyy");
        break;
      case 'last_year':
        formattedTime = format(date, "MMM d, yyyy");
        break;
      default:
        formattedTime = format(date, "MMM d, yyyy 'at' h:mm a");
    }

    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="font-semibold mb-2">{formattedTime}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;