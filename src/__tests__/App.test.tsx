import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fetchTodos, insertTodo } from "../supabase";

vi.mock("../supabase", () => ({
  fetchTodos: vi.fn(),
  insertTodo: vi.fn(),
  supabase: {},
}));

describe("App", () => {
  beforeEach(() => {
    vi.mocked(fetchTodos).mockReset();
    vi.mocked(insertTodo).mockReset();
    vi.mocked(fetchTodos).mockResolvedValue([]);
  });

  it("アプリタイトルが表示されてる", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: "📝 Todoアプリ!" }),
    ).toBeInTheDocument();
  });

  it("todoが追加できる", async () => {
    vi.mocked(fetchTodos)
      .mockResolvedValueOnce([{ id: 1, title: "既存", completed: false }])
      .mockResolvedValueOnce([
        { id: 2, title: "新しいタスク", completed: false },
        { id: 1, title: "既存", completed: false },
      ]);
    vi.mocked(insertTodo).mockResolvedValue(null);

    render(<App />);

    await waitFor(
      () => {
        const isLoading = screen.queryByText("Loading...");
        expect(isLoading).not.toBeInTheDocument();
      },
      {
        timeout: 10000,
      },
    );

    const items = screen.getAllByRole("listitem");
    const input = screen.getByRole("textbox", {
      name: "新しいタスクを入力",
    });

    fireEvent.change(input, { target: { value: "新しいタスク" } });

    const button = screen.getByRole("button", { name: "追加" });
    fireEvent.click(button);

    await waitFor(
      () => {
        const resultItems = screen.getAllByRole("listitem");
        expect(resultItems).toHaveLength(items.length + 1);
      },
      {
        timeout: 10000,
      },
    );
  });
});
