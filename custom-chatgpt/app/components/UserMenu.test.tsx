import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../actions", () => ({
  logoutUser: vi.fn(),
}));

import { logoutUser } from "../actions";
import UserMenu from "./UserMenu";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("UserMenu, logged out", () => {
  it("renders Log in / Sign up affordances and no user info", () => {
    render(
      <UserMenu
        user={null}
        onLoginClick={vi.fn()}
        onSignupClick={vi.fn()}
        onLoggedOut={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });

  it("calls onLoginClick / onSignupClick when clicked", async () => {
    const onLoginClick = vi.fn();
    const onSignupClick = vi.fn();
    render(
      <UserMenu
        user={null}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onLoggedOut={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Log in" }));
    expect(onLoginClick).toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));
    expect(onSignupClick).toHaveBeenCalled();
  });
});

describe("UserMenu, logged in", () => {
  it("renders the initials badge and email, with no login/signup controls", () => {
    render(
      <UserMenu
        user={{ id: 1, email: "jane.doe@example.com" }}
        onLoginClick={vi.fn()}
        onSignupClick={vi.fn()}
        onLoggedOut={vi.fn()}
      />,
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("jane.doe@example.com")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Log in" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign up" }),
    ).not.toBeInTheDocument();
  });

  it("opens a menu containing Log out when the badge is clicked", async () => {
    render(
      <UserMenu
        user={{ id: 1, email: "jane@example.com" }}
        onLoginClick={vi.fn()}
        onSignupClick={vi.fn()}
        onLoggedOut={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Log out" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /jane@example.com/i }));
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("calls logoutUser and reflects the logged-out state when Log out is clicked", async () => {
    vi.mocked(logoutUser).mockResolvedValue(undefined);
    const onLoggedOut = vi.fn();
    render(
      <UserMenu
        user={{ id: 1, email: "jane@example.com" }}
        onLoginClick={vi.fn()}
        onSignupClick={vi.fn()}
        onLoggedOut={onLoggedOut}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /jane@example.com/i }));
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));

    expect(logoutUser).toHaveBeenCalled();
    expect(onLoggedOut).toHaveBeenCalled();
  });
});
