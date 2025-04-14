import { render, screen } from "@testing-library/react";
import SettingsCard from "../components/SettingsCard";

describe("SettingsCard Component", () => {
  test("renders 'Manage your notifications' text", () => {
    render(<SettingsCard />);

    expect(
      screen.getByText("Manage your notifications")
    ).toBeInTheDocument();
  });

  test("renders 'View settings' link", () => {
    render(<SettingsCard />);

    const linkElement = screen.getByRole("link", { name: /View settings/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "#");
  });
});
