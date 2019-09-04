import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";

import DayList from "components/DayList";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    const getDays = axios.get("/api/days");
    const getAppointments = axios.get("/api/appointments");
    const getInterviewers = axios.get("/api/interviewers");

    Promise.all([getDays, getAppointments, getInterviewers])
      .then(response => {
        setState(prev => ({
          ...prev,
          days: response[0].data,
          appointments: response[1].data,
          interviewers: response[2].data
        }));
      })
      .catch(error => console.log(error));
  }, []);

  const daysAppointments = getAppointmentsForDay(state, state.day);
  const daysInterviews = getInterviewersForDay(state, state.day);

  function bookInterview(id, interview) {
    const putInterview = axios.put(`/api/appointments/${id}`, {interview});

    return Promise.all([putInterview])
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        setState({ ...state, appointments });
      })
      .catch(error => console.log(error));
  }

  function cancelInterview(id) {
    const deleteInterview = axios.delete(`/api/appointments/${id}`);

    return Promise.all([deleteInterview])
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        setState({ ...state, appointments });
      })
      .catch(error => console.log(error));
  }

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
            bookInterview={bookInterview}
            cancelInterview={cancelInterview}
          />
        ))}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
