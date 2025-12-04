export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Products {
  productsData: Product[];
  onSelect: (product: Product) => void;
}

export interface TransactionResult {
  success: boolean;
  message: string;
  change: number[];
  updatedProduct?: Product;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}
