import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../actions", () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

import { loginUser, registerUser } from "../actions";
import AuthForm from "./AuthForm";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AuthForm", () => {
  it("renders email and password fields with a Log in submit button in login mode", () => {
    render(<AuthForm mode="login" onSuccess={vi.fn()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  it("renders a Sign up submit button in signup mode", () => {
    render(<AuthForm mode="signup" onSuccess={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("calls loginUser with the form values in login mode", async () => {
    vi.mocked(loginUser).mockResolvedValue({ id: 1, email: "jane@example.com" });
    const onSuccess = vi.fn();
    render(<AuthForm mode="login" onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(loginUser).toHaveBeenCalledWith("jane@example.com", "password123");
    expect(onSuccess).toHaveBeenCalledWith({ id: 1, email: "jane@example.com" });
  });

  it("calls registerUser with the form values in signup mode", async () => {
    vi.mocked(registerUser).mockResolvedValue({ id: 1, email: "jane@example.com" });
    const onSuccess = vi.fn();
    render(<AuthForm mode="signup" onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(registerUser).toHaveBeenCalledWith("jane@example.com", "password123");
    expect(onSuccess).toHaveBeenCalledWith({ id: 1, email: "jane@example.com" });
  });

  it("shows the server error, keeps input, and does not navigate away on failure", async () => {
    vi.mocked(loginUser).mockRejectedValue(new Error("Invalid email or password."));
    const onSuccess = vi.fn();
    render(<AuthForm mode="login" onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveValue("jane@example.com");
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("blocks submission and never calls the action when fields are empty", async () => {
    render(<AuthForm mode="login" onSuccess={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(loginUser).not.toHaveBeenCalled();
  });

  it("disables the submit button while the action is pending", async () => {
    let resolveLogin!: (value: { id: number; email: string }) => void;
    vi.mocked(loginUser).mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    render(<AuthForm mode="login" onSuccess={vi.fn()} />);

    await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(screen.getByRole("button", { name: "Log in" })).toBeDisabled();
    resolveLogin({ id: 1, email: "jane@example.com" });
  });
});
