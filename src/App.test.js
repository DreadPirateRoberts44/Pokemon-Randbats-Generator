import { render, screen } from "@testing-library/react";
import Team from "./Team";

test("renders learn react link", () => {
  render(<Team />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
