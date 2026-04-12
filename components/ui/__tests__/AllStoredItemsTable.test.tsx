import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AllStoredItemsTable from "../AllStoredItemsTable";
import { useCurrentStoredData } from "@/store";

jest.mock("@/store", () => ({
  useCurrentStoredData: jest.fn(),
}));

const mockUseCurrentStoredData = useCurrentStoredData as jest.MockedFunction<
  typeof useCurrentStoredData
>;

const mockData = [
  {
    id: 1,
    product_id: "P001",
    product_name: "商品A",
    category: "カテゴリ1",
    current_stored: 10,
    minimum_stored: 5,
    status: "normal" as const,
    created_at: new Date("2025-01-01"),
    updated_at: new Date("2025-02-01T10:00:00"),
  },
  {
    id: 2,
    product_id: "P002",
    product_name: "商品B",
    category: "カテゴリ2",
    current_stored: 2,
    minimum_stored: 5,
    status: "caution" as const,
    created_at: new Date("2025-01-02"),
    updated_at: new Date("2025-02-02T12:00:00"),
  },
];

describe("AllStoredItemsTable", () => {
  beforeEach(() => {
    mockUseCurrentStoredData.mockReturnValue({
      currentStoredData: mockData,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    });
  });

  describe("レンダリング", () => {
    it("タイトルと説明が表示される", () => {
      render(<AllStoredItemsTable />);
      expect(screen.getByText("商品在庫一覧")).toBeInTheDocument();
      expect(screen.getByText("全商品の在庫状況と詳細情報")).toBeInTheDocument();
    });

    it("検索入力欄が表示される", () => {
      render(<AllStoredItemsTable />);
      expect(screen.getByPlaceholderText("商品を検索...")).toBeInTheDocument();
    });

    it("テーブルヘッダーが表示される", () => {
      render(<AllStoredItemsTable />);
      expect(screen.getByRole("columnheader", { name: /商品ID/ })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /商品名/ })).toBeInTheDocument();
    });
  });

  describe("データ表示", () => {
    it("モックデータの商品名が表示される", () => {
      render(<AllStoredItemsTable />);
      expect(screen.getByText("商品A")).toBeInTheDocument();
      expect(screen.getByText("商品B")).toBeInTheDocument();
    });

    it("ステータスラベルが表示される", () => {
      render(<AllStoredItemsTable />);
      expect(screen.getByText("正常")).toBeInTheDocument();
      expect(screen.getByText("低在庫")).toBeInTheDocument();
    });
  });

  describe("検索フィルター", () => {
    it("検索欄に入力すると該当商品だけ表示される", async () => {
      const user = userEvent.setup();
      render(<AllStoredItemsTable />);
      const input = screen.getByPlaceholderText("商品を検索...");
      await user.type(input, "商品A");
      expect(screen.getByText("商品A")).toBeInTheDocument();
      expect(screen.queryByText("商品B")).not.toBeInTheDocument();
    });
  });

  describe("発注モーダル", () => {
    it("発注ボタンをクリックするとモーダルが開く", async () => {
      const user = userEvent.setup();
      render(<AllStoredItemsTable />);
      const orderButtons = screen.getAllByRole("button", { name: "発注" });
      await user.click(orderButtons[0]);
      expect(screen.getByText("商品発注メニュー")).toBeInTheDocument();
      expect(screen.getByText("商品名:商品A")).toBeInTheDocument();
    });
  });
});
