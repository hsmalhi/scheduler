import { useEffect, useReducer } from "react";
import axios from "axios";
require("dotenv").config();

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const updateSpots = function(state, decrease) {
  return state.days.map(day => {
    if (day.name !== state.day) {
      return day;
    }

    return {
      ...day,
      spots: decrease ? day.spots-- : day.spots++
    };
  });
};

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY: {
      return { ...state, day: action.day };
    }
    case SET_APPLICATION_DATA: {
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    }
    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview ? { ...action.interview } : null
      };

      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };

      let days = state.days;
      
      if (action.interview && !state.appointments[action.id].interview) {
        days = updateSpots(state, true);
      } else if (!action.interview && state.appointments[action.id].interview) {
        days = updateSpots(state, false);
      }

      return { ...state, ...days, appointments };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
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
          days: response[0].data,
          appointments: response[1].data,
          interviewers: response[2].data
        });
      })
      .catch(error => {
        throw error;
      });

    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = function(event) {
      console.log("Began listening for updates from the scheduler-api server.");
    };

    webSocket.onmessage = function(event) {
      event = JSON.parse(event.data);

      if (event.type === SET_INTERVIEW) {
        console.log({...event});
        dispatch({ ...event });
      } else {
        console.log(
          "Event details came from the server but were never handled:",
          event
        );
      }
    };
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, day });

  const bookInterview = function(id, interview) {
    const putInterview = axios.put(`/api/appointments/${id}`, {
      interview: interview
    });

    return Promise.all([putInterview])
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview });
      })
      .catch(error => {
        throw error;
      });
  };

  const cancelInterview = function(id) {
    const deleteInterview = axios.delete(`/api/appointments/${id}`);

    return Promise.all([deleteInterview])
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id });
      })
      .catch(error => {
        throw error;
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
}
