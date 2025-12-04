import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import { formatCurrency } from "../utils/format";
import { Products } from "../types/Products";

export const ProductList = ({ productsData, onSelect }: Products) => {
  return (
    <Grid container spacing={2}>
      {productsData.map((p) => (
        <Grid item xs={12} sm={6} md={4} key={p.id} mt={3}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  color: "primary.main",
                  minHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "secondary.main", mt: 1 }}
              >
                Price: {formatCurrency(p.price)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Quantity: {p.quantity}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pb: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => onSelect(p)}
                disabled={p.quantity <= 0}
              >
                {p.quantity > 0 ? "Purchase" : "Out of stock"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
