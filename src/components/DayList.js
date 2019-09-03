import React from "react";

import DayListItem from "./DayListItem";

export default function DayList(props) {
  const dayListItem = function(day, setDay) {
    return (<DayListItem
      key={day.id}
      name={day.name}
      spots={day.spots}
      selected={day.name === props.day}
      setDay={setDay}
    />);
  };

  return (
    <ul>
      {props.days.map(day => dayListItem(day, props.setDay))}
    </ul>
  );
}
