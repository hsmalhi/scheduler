import React from "react";

import "components/DayListItem.scss";

import classNames from "classnames";

export default function DayListItem(props) {
  let dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": (props.spots === 0)
  });

  let spotsRemaining = (props.spots === 0 ? "no" : props.spots);

  spotsRemaining += ((props.spots > 1 || props.spots < 1)? " spots remaining" : " spot remaining");

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{spotsRemaining}</h3>
    </li>
  );
}