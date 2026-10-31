import { useContext } from "react";
import CartContext from "../context/CartContext";

export default function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }

  return value;
}