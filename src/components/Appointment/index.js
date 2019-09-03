import React, { useState } from "react";

import 'components/Appointment/styles.scss'

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import { action } from "@storybook/addon-actions/dist/preview";


export default function Appointment(props){
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer} onEdit={action("onEdit")} onDelete={action("onDelete")}/> : <Empty onAdd={action("onAdd")}/>}
    </article>
  );
}