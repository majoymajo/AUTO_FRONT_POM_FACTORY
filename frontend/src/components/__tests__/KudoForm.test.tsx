import { render, screen, fireEvent } from "@testing-library/react";
import { KudoFormSystem } from "../KudoForm";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useKudoForm } from "../../hooks/forms/useKudoForm";

// Mock the hook that KudoForm uses
vi.mock("../../hooks/forms/useKudoForm", () => ({
  useKudoForm: vi.fn(),
}));

const mockRegister = vi.fn();
const mockHandleStart = vi.fn();

const defaultHookResult = {
  sliderValue: 0,
  isDragging: false,
  loadingAvatar: false,
  sliderRef: { current: null },
  register: mockRegister,
  toUser: null,
  USERS: [
    {
      id: "1",
      name: "Santiago Arias",
      email: "santiago@sofkianos.com",
      avatar: "",
    },
  ],
  KUDO_CATEGORIES: ["Innovation", "Teamwork"],
  handleStart: mockHandleStart,
  formData: { message: "" },
};

describe("KudoForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useKudoForm).mockReturnValue(defaultHookResult as any);
  });

  it("renders the form fields", () => {
    render(<KudoFormSystem />);

    expect(screen.getByText("De (Remitente)")).toBeInTheDocument();
    expect(screen.getByText("Para (Destino)")).toBeInTheDocument();
    expect(screen.getByText("Selecciona compañero...")).toBeInTheDocument();
  });

  it("shows loading state for avatar", () => {
    vi.mocked(useKudoForm).mockReturnValue({
      ...defaultHookResult,
      loadingAvatar: true,
    } as any);

    render(<KudoFormSystem />);
    // When loading, the 'Identity' alt image should NOT be present
    expect(screen.queryByAltText("Identity")).not.toBeInTheDocument();
  });

  it("displays user avatar when toUser is selected", () => {
    vi.mocked(useKudoForm).mockReturnValue({
      ...defaultHookResult,
      toUser: { name: "Santiago", avatar: "test-avatar.jpg" },
    } as any);

    render(<KudoFormSystem />);
    const avatar = screen.getByAltText("Identity");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "test-avatar.jpg");
  });
});
