import React from "react";

import DayListItem from "./DayListItem";

// import classNames from "classnames";

export default function DayList(props) {
  const dayListItem = function(day, setDay) {
    return (<DayListItem
      name={day.name}
      spots={day.spots}
      selected={day.name === props.day}
      setDay={setDay}
    />);
  };

  // let dayListClass = classNames("day-list", {});

  return (
    <ul>
      {props.days.map(day => dayListItem(day, props.setDay))}
    </ul>
  );
}
