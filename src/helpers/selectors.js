export function getAppointmentsForDay(state, day) {
  const appointments = (state.days.find(element => element.name === day) ? state.days.find(element => element.name === day).appointments : []);
  const daysAppointments = []
  appointments.forEach(appointment => daysAppointments.push(state.appointments[appointment]));
  return daysAppointments;
}

export function getInterview(state, interview) {
  return interview ? {
    "student": interview.student,
    "interviewer": state.interviewers[interview.interviewer]
  } : null ;
}