import React from "react";

import "components/Application.scss";

import DayList from "components/DayList";
import Appointment from "components/Appointment";

import useApplicationData from "hooks/useApplicationData";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "helpers/selectors";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const daysAppointments = getAppointmentsForDay(state, state.day);
  const daysInterviews = getInterviewersForDay(state, state.day);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {daysAppointments.map(appointment => (
          <Appointment
            key={appointment.id}
            {...appointment}
            interview={getInterview(state, appointment.interview)}
            interviewers={daysInterviews}
            bookInterview={(id, interview) => bookInterview(id, interview).catch(err => {
              throw err
            })}
            cancelInterview={id => cancelInterview(id).catch(err => {
              throw err
            })}
          />
        ))}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
