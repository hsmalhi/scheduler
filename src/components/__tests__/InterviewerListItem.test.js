import React from "react";

import { render, cleanup } from "@testing-library/react";

import InterviewerListItems from "components/InterviewerListItem";

afterEach(cleanup);

it("renders without crashing", () => {
  render(<InterviewerListItems />);
});