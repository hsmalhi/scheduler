import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

require("dotenv").config();

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
          type: SET_APPLICATION_DATA,
          days: response[0].data,
          appointments: response[1].data,
          interviewers: response[2].data
        });
      })
      .catch(error => {
        throw error;
      });

    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onmessage = function(event) {
      event = JSON.parse(event.data);

      if (event.type === SET_INTERVIEW) {
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
