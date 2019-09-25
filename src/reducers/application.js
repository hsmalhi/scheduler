export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

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

export default function reducer(state, action) {
  switch (action.type) {
    // case SET_DAY: {
    //   return { ...state, day: action.day };
    // }
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