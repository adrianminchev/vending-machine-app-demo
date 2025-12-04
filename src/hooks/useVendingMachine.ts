import { useCallback, useEffect, useState } from "react";
import {
  ACCEPTED_DENOMINATIONS_VALUES,
  MAX_CENTS_INSERT,
} from "../config/cents";
import { MOCK_API_DATA } from "../api/mockApiData";
import { MAX_QUANTITY_PER_PRODUCT } from "../config/products";
import { Product, TransactionResult } from "../types/Products";
import { initialCents } from "../types/CentInventory";

const validatedProducts: Product[] = MOCK_API_DATA.map((product) => {
  const quantity =
    product.quantity > MAX_QUANTITY_PER_PRODUCT
      ? MAX_QUANTITY_PER_PRODUCT
      : product.quantity;

  return { ...product, quantity };
});

export const useVendingMachine = () => {
  const [products, setProducts] = useState<Product[]>(validatedProducts);
  const [insertedAmount, setInsertedAmount] = useState<number>(0);
  const [insertedCents, setInsertedCents] = useState<Record<number, number>>(
    {}
  );
  const [centInventory, setCentInventory] = useState<Record<number, number>>({
    ...initialCents,
  });

  const insertCent = useCallback(
    (amount: number): TransactionResult => {
      if (!ACCEPTED_DENOMINATIONS_VALUES.includes(amount)) {
        return {
          success: false,
          message: "Rejected denomination type!",
          change: [],
        };
      }
      if (insertedAmount + amount > MAX_CENTS_INSERT) {
        return {
          success: false,
          message:
            "Maximum amount reached. Please proceed with a purchase or return cents.",
          change: [],
        };
      }

      setInsertedAmount((prev) => prev + amount);
      setInsertedCents((prev) => ({
        ...prev,
        [amount]: (prev[amount] ?? 0) + 1,
      }));
      setCentInventory((prev) => ({
        ...prev,
        [amount]: (prev[amount] ?? 0) + 1,
      }));

      return { success: true, message: "Cents accepted!", change: [] };
    },
    [insertedAmount]
  );

  const purchase = useCallback(
    async (productId: string): Promise<TransactionResult> => {
      const product = products.find((p) => p.id === productId);

      if (!product) {
        return { success: false, message: "Product not found", change: [] };
      }

      if (product.quantity <= 0) {
        return { success: false, message: "Out of stock", change: [] };
      }

      if (insertedAmount < product.price) {
        return { success: false, message: "Insufficient amount", change: [] };
      }

      let changeAmount = insertedAmount - product.price;
      const changeCents: number[] = [];

      const sortedCents = Object.keys(centInventory)
        .map(Number)
        .sort((a, b) => b - a);

      const tempInventory = { ...centInventory };

      for (const centValue of sortedCents) {
        const availableCents = tempInventory[centValue] ?? 0;
        const neededCents = Math.floor(changeAmount / centValue);
        const centsToUse = Math.min(availableCents, neededCents);

        if (centsToUse > 0) {
          changeAmount -= centsToUse * centValue;
          tempInventory[centValue] -= centsToUse;

          for (let i = 0; i < centsToUse; i++) {
            changeCents.push(centValue);
          }
        }
      }

      if (changeAmount > 0) {
        return {
          success: false,
          message: "Cannot return exact change",
          change: [],
        };
      }

      const updatedProducts = products.map((currentProduct) => {
        if (currentProduct.id === product.id) {
          return { ...currentProduct, quantity: currentProduct.quantity - 1 };
        }

        return currentProduct;
      });

      setProducts(updatedProducts);
      setCentInventory(tempInventory);
      setInsertedAmount(0);
      setInsertedCents({});

      return {
        success: true,
        message: "Purchase successful",
        change: changeCents,
        updatedProduct: { ...product, quantity: product.quantity - 1 },
      };
    },

    [insertedAmount, products, centInventory]
  );

  const reset = useCallback((): TransactionResult => {
    const centsToReturn: number[] = [];

    Object.entries(insertedCents).forEach(([denom, count]) => {
      for (let i = 0; i < count; i++) {
        centsToReturn.push(Number(denom));
      }
    });

    setInsertedAmount(0);
    setInsertedCents({});

    return centsToReturn.length > 0
      ? { success: true, message: "Returned cents", change: centsToReturn }
      : { success: false, message: "No cents to return", change: [] };
  }, [insertedCents]);

  return {
    products,
    insertedAmount,
    insertedCents,
    centInventory,
    insertCent,
    purchase,
    reset,
  };
};
