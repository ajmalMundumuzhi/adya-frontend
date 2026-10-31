import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import CartContext from "./CartContext";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCustomerCart,
} from "../services/cart.service";

const CART_STORAGE_KEY = "adya-cart";
const MAX_QUANTITY = 9;

function getCustomerToken() {
  return localStorage.getItem("adya-customer-token");
}

function getStoredGuestCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(lines) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    return;
  }
}

function getProductId(product) {
  return String(
    product?.productId?._id ||
    product?.productId ||
    product?.id ||
    "",
  );
}

function getVariantId(product) {
  return String(
    product?.variantId?._id ||
    product?.variantId ||
    "",
  );
}

function getSizeOptionId(product) {
  return String(
    product?.sizeOptionId?._id ||
    product?.sizeOptionId ||
    product?.selectedSize?._id ||
    "",
  );
}

function createGuestLineId(product) {
  return [
    getProductId(product),
    getVariantId(product),
    getSizeOptionId(product),
  ].join("-");
}

function formatBackendCart(cart) {
  const items = Array.isArray(cart?.items) ? cart.items : [];

  return items
    .map((item) => {
      const productData = item.productId;
      const variantData = item.variantId;

      if (
        !productData ||
        typeof productData !== "object" ||
        !variantData ||
        typeof variantData !== "object"
      ) {
        return null;
      }

      const sizeOptionId = String(item.sizeOptionId || "");

      const selectedSize = (variantData.sizes || []).find(
        (size) => String(size._id) === sizeOptionId,
      );

      if (!selectedSize) {
        return null;
      }

      const images = variantData.images || [];
      const productId = String(productData._id);
      const variantId = String(variantData._id);

      const product = {
        id: productId,
        productId,
        name: productData.name,
        slug: productData.slug,
        description: productData.description || "",
        variantId,
        sizeOptionId,
        selectedColor: variantData.color,
        selectedSize: selectedSize.size,
        sku: selectedSize.sku || "",
        price: Number(selectedSize.price || 0),
        compareAtPrice: Number(selectedSize.compareAtPrice || 0),
        stock: Number(selectedSize.stock || 0),
        image: images[0] || "",
        images,
        variant: variantData,
        size: selectedSize,
      };

      return {
        lineId: String(item._id),
        cartItemId: String(item._id),
        productId,
        variantId,
        sizeOptionId,
        quantity: Number(item.quantity || 1),
        product,
      };
    })
    .filter(Boolean);
}

function formatGuestCart(lines) {
  return lines.map((line) => {
    const product = line.product || {};
    const productId = getProductId(product) || String(line.productId || "");
    const variantId = getVariantId(product);
    const sizeOptionId = getSizeOptionId(product);

    return {
      ...line,
      lineId:
        line.lineId ||
        createGuestLineId({
          ...product,
          id: productId,
          variantId,
          sizeOptionId,
        }),
      productId,
      variantId,
      sizeOptionId,
      quantity: Number(line.quantity || 1),
      product: {
        ...product,
        id: productId,
        productId,
        variantId,
        sizeOptionId,
      },
    };
  });
}

function getSafeQuantity(quantity, stock) {
  const requested = Math.floor(Number(quantity));

  if (!Number.isFinite(requested)) {
    return 1;
  }

  const stockLimit = Math.max(0, Number(stock || 0));

  return Math.min(
    MAX_QUANTITY,
    stockLimit || MAX_QUANTITY,
    Math.max(1, requested),
  );
}

export default function CartProvider({ children }) {
  const [lines, setLines] = useState(() => {
    return formatGuestCart(getStoredGuestCart());
  });

  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(getCustomerToken());

  const loadCustomerCart = useCallback(async () => {
    const cart = await getCart();
    const backendLines = formatBackendCart(cart);

    setLines(backendLines);

    return backendLines;
  }, []);

  const syncGuestCart = useCallback(async () => {
    const guestLines = formatGuestCart(getStoredGuestCart());

    if (!guestLines.length) {
      return loadCustomerCart();
    }

    for (const line of guestLines) {
      if (
        !line.productId ||
        !line.variantId ||
        !line.sizeOptionId
      ) {
        continue;
      }

      await addCartItem({
        productId: line.productId,
        variantId: line.variantId,
        sizeOptionId: line.sizeOptionId,
        quantity: getSafeQuantity(
          line.quantity,
          line.product?.stock,
        ),
      });
    }

    saveGuestCart([]);

    return loadCustomerCart();
  }, [loadCustomerCart]);

  const refreshCart = useCallback(async () => {
    if (!getCustomerToken()) {
      const guestLines = formatGuestCart(getStoredGuestCart());
      setLines(guestLines);
      return guestLines;
    }

    return loadCustomerCart();
  }, [loadCustomerCart]);

  useEffect(() => {
    let active = true;

    async function initializeCart() {
      setLoading(true);

      try {
        if (getCustomerToken()) {
          await syncGuestCart();
        } else {
          setLines(formatGuestCart(getStoredGuestCart()));
        }
      } catch (error) {
        console.error("Unable to load cart:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initializeCart();

    const handleAuthChange = async () => {
      setLoading(true);

      try {
        if (getCustomerToken()) {
          await syncGuestCart();
        } else {
          setLines(formatGuestCart(getStoredGuestCart()));
        }
      } catch (error) {
        console.error("Unable to synchronize cart:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    window.addEventListener("adya-auth-change", handleAuthChange);

    return () => {
      active = false;
      window.removeEventListener(
        "adya-auth-change",
        handleAuthChange,
      );
    };
  }, [syncGuestCart]);

  useEffect(() => {
    if (!getCustomerToken()) {
      saveGuestCart(lines);
    }
  }, [lines]);

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      const productId = getProductId(product);
      const variantId = getVariantId(product);
      const sizeOptionId = getSizeOptionId(product);

      if (!productId || !variantId || !sizeOptionId) {
        throw new Error(
          "Product, variant and size must be selected before adding to cart.",
        );
      }

      const safeQuantity = getSafeQuantity(
        quantity,
        product.stock,
      );

      if (getCustomerToken()) {
        await addCartItem({
          productId,
          variantId,
          sizeOptionId,
          quantity: safeQuantity,
        });

        await loadCustomerCart();
        return;
      }

      setLines((current) => {
        const lineId = createGuestLineId(product);

        const existing = current.find(
          (line) => line.lineId === lineId,
        );

        if (existing) {
          return current.map((line) => {
            if (line.lineId !== lineId) {
              return line;
            }

            return {
              ...line,
              quantity: getSafeQuantity(
                line.quantity + safeQuantity,
                product.stock,
              ),
              product,
            };
          });
        }

        return [
          ...current,
          {
            lineId,
            productId,
            variantId,
            sizeOptionId,
            quantity: safeQuantity,
            product,
          },
        ];
      });
    },
    [loadCustomerCart],
  );

  const removeFromCart = useCallback(
    async (lineId) => {
      if (getCustomerToken()) {
        await removeCartItem(lineId);
        await loadCustomerCart();
        return;
      }

      setLines((current) =>
        current.filter((line) => line.lineId !== lineId),
      );
    },
    [loadCustomerCart],
  );

  const updateQuantity = useCallback(
    async (lineId, quantity) => {
      const safeQuantity = Math.floor(Number(quantity));

      if (!Number.isFinite(safeQuantity)) {
        return;
      }

      if (safeQuantity <= 0) {
        return;
      }

      if (getCustomerToken()) {
        await updateCartItem(lineId, safeQuantity);
        await loadCustomerCart();
        return;
      }

      setLines((current) =>
        current.map((line) => {
          if (line.lineId !== lineId) {
            return line;
          }

          return {
            ...line,
            quantity: getSafeQuantity(
              safeQuantity,
              line.product?.stock,
            ),
          };
        }),
      );
    },
    [loadCustomerCart],
  );

  const setCartQuantity = useCallback(
    async (lineId, quantity) => {
      await updateQuantity(lineId, quantity);
    },
    [updateQuantity],
  );

  const clearCart = useCallback(async () => {
    if (getCustomerToken()) {
      await clearCustomerCart();
      setLines([]);
      await loadCustomerCart();
      return;
    }

    setLines([]);
    saveGuestCart([]);
  }, [loadCustomerCart]);

  const itemCount = useMemo(
    () =>
      lines.reduce(
        (total, line) => total + Number(line.quantity || 0),
        0,
      ),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      loading,
      isAuthenticated,
      addToCart,
      removeFromCart,
      updateQuantity,
      setCartQuantity,
      clearCart,
      refreshCart,
    }),
    [
      lines,
      itemCount,
      loading,
      isAuthenticated,
      addToCart,
      removeFromCart,
      updateQuantity,
      setCartQuantity,
      clearCart,
      refreshCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}