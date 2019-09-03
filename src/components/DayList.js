import React from "react";

import DayListItem from "./DayListItem";

export default function DayList(props) {
  const renderDayListItem = function(day) {
    return (<DayListItem
      key={day.id}
      name={day.name}
      spots={day.spots}
      selected={day.name === props.day}
      setDay={props.setDay}
    />);
  };

  return (
    <ul>
      {props.days.map(day => renderDayListItem(day))}
    </ul>
  );
}
