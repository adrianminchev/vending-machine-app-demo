import { useState } from "react";
import { Button, Typography, Snackbar, Alert, Box } from "@mui/material";
import { formatCurrency } from "../utils/format";
import { ACCEPTED_DENOMINATIONS_VALUES } from "../config/cents";
import { useVendingMachine } from "../hooks/useVendingMachine";
import { ProductList } from "./ProductList";
import { Product, SnackbarState } from "../types/Products";

export const VendingMachine = () => {
  const { products, insertedAmount, insertCent, purchase, reset } =
    useVendingMachine();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const onInsertCent = (value: number) => {
    const res = insertCent(value);

    if (!res.success) {
      showMessage(res.message, "error");
    }
  };

  const onPurchase = async (product: Product) => {
    const res = await purchase(product.id);

    if (!res?.success) {
      showMessage(res?.message, "error");

      return;
    }

    const hasChange = res.change?.length > 0;
    const formattedChange = hasChange
      ? res.change.map(formatCurrency).join(", ")
      : "";

    const message = hasChange
      ? `${res.message} - Change cents: ${formattedChange}`
      : res.message;

    showMessage(message, "success");
  };

  const onReturnCents = () => {
    const res = reset();

    if (!res.success) {
      return showMessage(res.message, "error");
    }

    const formatted = res.change.map(formatCurrency).join(", ");

    showMessage(`Cents returned: ${formatted}`, "success");
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          sx={{
            backgroundColor:
              snackbar.severity === "success" ? "#22c55e" : "#ef4444",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          p: 2,
          background: "linear-gradient(180deg, #0d1117, #1a1e25)",
          borderRadius: 4,
          boxShadow: "0 0 25px rgba(0, 0, 0, 0.8)",
          maxWidth: 500,
          margin: "auto",
          my: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Vending Machine
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography sx={{ opacity: 0.9 }}>
            Inserted amount:
            <Typography component="span" fontWeight="bold" sx={{ pl: 0.5 }}>
              {formatCurrency(insertedAmount)}
            </Typography>
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            disabled={insertedAmount === 0}
            onClick={onReturnCents}
          >
            Return cents
          </Button>
        </Box>
        <Typography sx={{ mt: 2, fontWeight: "bold", opacity: 0.6 }}>
          Insert one or more of the supported cents to proceed:
        </Typography>
        {ACCEPTED_DENOMINATIONS_VALUES.map((x) => (
          <Button
            key={x}
            variant="contained"
            sx={{ mr: 1.5, ml: 0.5, mt: 1 }}
            onClick={() => onInsertCent(x)}
          >
            <Typography component="span" fontWeight="bold">
              {formatCurrency(x)}
            </Typography>
          </Button>
        ))}
        <ProductList productsData={products} onSelect={onPurchase} />
      </Box>
    </>
  );
};
