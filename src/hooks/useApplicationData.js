import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY: {
        return { ...state, day: action.value.day };
      }
      case SET_APPLICATION_DATA: {
        return {
          ...state,
          days: action.value.days,
          appointments: action.value.appointments,
          interviewers: action.value.interviewers
        };
      }
      case SET_INTERVIEW: {
        if (action.value.interview) {
          const appointment = {
            ...state.appointments[action.value.id],
            interview: { ...action.value.interview }
          };

          const appointments = {
            ...state.appointments,
            [action.value.id]: appointment
          };

          return { ...state, appointments };
        } else {
          const appointment = {
            ...state.appointments[action.value.id],
            interview: null
          };

          const appointments = {
            ...state.appointments,
            [action.value.id]: appointment
          };

          return { ...state, appointments };
        }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    const getDays = axios.get("/api/days");
    const getAppointments = axios.get("/api/appointments");
    const getInterviewers = axios.get("/api/interviewers");

    Promise.all([getDays, getAppointments, getInterviewers])
      .then(response => {
        dispatch({
          type: "SET_APPLICATION_DATA",
          value: {
            days: response[0].data,
            appointments: response[1].data,
            interviewers: response[2].data
          }
        });
      })
      .catch(error => {
        throw error;
      });
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, value: { day } });

  const bookInterview = function(id, interview) {
    const putInterview = axios.put(`/api/appointments/${id}`, {
      interview: interview
    });

    return Promise.all([putInterview])
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: { id, interview } });
      })
      .catch(error => {
        throw error;
      });
  };

  const cancelInterview = function(id) {
    const deleteInterview = axios.delete(`/api/appointments/${id}`);

    return Promise.all([deleteInterview])
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: { id } });
      })
      .catch(error => {
        throw error;
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
}
