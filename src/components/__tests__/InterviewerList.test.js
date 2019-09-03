import React from "react";

import { render, cleanup } from "@testing-library/react";

import InterviewerList from "components/InterviewerListItem";

afterEach(cleanup);

it("renders without crashing", () => {
  render(<InterviewerList />);
});