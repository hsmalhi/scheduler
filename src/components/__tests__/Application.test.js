import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  waitForElementToBeRemoved,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  prettyDOM
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    try {
      await waitForElement(() => getByText(container, "Archie Cohen"));
    } catch (error) {
      throw error;
    }

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    // debug();

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    try {
      await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    } catch (error) {
      throw error;
    }

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    
  });
});
