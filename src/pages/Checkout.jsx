
import { useCallback, useEffect, useMemo, useState, useContext } from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import CurrencyContext from "../context/CurrencyContext";
import { getAddresses } from "../services/address.service";
import {
  createCheckoutOrder,
  createStripeCheckoutSession,
  getShippingRate
} from "../services/checkout.service";
import CheckoutAddress from "../components/checkout/CheckoutAddress";
import CheckoutOrderSummary from "../components/checkout/CheckoutOrderSummary";

const COUNTRY_CURRENCIES = {
  Australia: "AUD",
  "New Zealand": "NZD",
  "United States": "USD",
  Canada: "CAD",
  "United Kingdom": "GBP",
  Malaysia: "MYR",
  Singapore: "SGD"
};

export default function Checkout() {
  const { lines } = useCart();
  const currencyContext = useContext(CurrencyContext);

  const { country: selectedCountry } = currencyContext || {};

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [shippingChargeAUD, setShippingChargeAUD] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [pendingOrder, setPendingOrder] = useState(null);

  const selectedAddress = useMemo(
    () => addresses.find(address => address._id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const orderCurrency = selectedAddress
    ? COUNTRY_CURRENCIES[selectedAddress.country]
    : selectedCountry?.currency || "AUD";

  const formatOrderPrice = useCallback(
    amountAUD => {
      const rate = Number(currencyContext?.rates?.[orderCurrency] || 1);

      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: orderCurrency
      }).format(Number(amountAUD || 0) * rate);
    },
    [currencyContext?.rates, orderCurrency]
  );

  useEffect(() => {
    let active = true;

    async function loadAddresses() {
      try {
        setLoadingAddresses(true);

        const result = await getAddresses();

        if (!active) return;

        const supported = result.filter(address =>
          Object.prototype.hasOwnProperty.call(
            COUNTRY_CURRENCIES,
            address.country
          )
        );

        setAddresses(supported);

        const defaultAddress =
          supported.find(address => address.isDefault) || supported[0];

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load your saved addresses"
          );
        }
      } finally {
        if (active) setLoadingAddresses(false);
      }
    }

    loadAddresses();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadShipping() {
      setShippingChargeAUD(null);

      if (!selectedAddress) return;

      try {
        setLoadingShipping(true);
        setError("");

        const result = await getShippingRate(
          selectedAddress.country,
          selectedAddress.city
        );

        const rate = Number(result?.rate ?? result?.shippingRate?.rate);

        if (!Number.isFinite(rate) || rate < 0) {
          throw new Error("The shipping response did not contain a valid rate");
        }

        if (active) setShippingChargeAUD(rate);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Shipping is not available for this address"
          );
        }
      } finally {
        if (active) setLoadingShipping(false);
      }
    }

    loadShipping();

    return () => {
      active = false;
    };
  }, [selectedAddress]);

  const handleAddressSelect = addressId => {
    setSelectedAddressId(addressId);
    setPendingOrder(null);
    setError("");
  };

  const getOrderId = order => {
    return (
      order?._id ||
      order?.id ||
      order?.order?._id ||
      order?.order?.id ||
      order?.data?._id ||
      order?.data?.id
    );
  };

  const handlePlaceOrder = async () => {
    setError("");

    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    if (shippingChargeAUD === null) {
      setError("Shipping has not been calculated for this address");
      return;
    }

    if (!lines.length) {
      setError("Your cart is empty");
      return;
    }

    const currency = COUNTRY_CURRENCIES[selectedAddress.country];

    if (!currency) {
      setError("Delivery is not available in this country");
      return;
    }

    const items = lines.map(line => ({
      productId: String(
        line.productId ||
          line.product?.productId ||
          line.product?.id ||
          ""
      ),
      variantId: String(line.variantId || ""),
      sizeOptionId: String(line.sizeOptionId || ""),
      quantity: Number(line.quantity)
    }));

    if (
      items.some(
        item =>
          !item.productId ||
          !item.variantId ||
          !item.sizeOptionId ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
      )
    ) {
      setError(
        "One or more cart items are missing product, variant, or size information. Please update your cart."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      let order = pendingOrder;

      if (!order) {
        order = await createCheckoutOrder({
          addressId: selectedAddress._id,
          currency,
          items
        });

        const orderId = getOrderId(order);

        if (!orderId) {
          throw new Error(
            "The order was created, but the server did not return an order ID."
          );
        }

        order = {
          ...order,
          _id: orderId
        };

        setPendingOrder(order);
      }

      const orderId = getOrderId(order);

      if (!orderId) {
        throw new Error("Unable to identify your order. Please contact support.");
      }

      const session = await createStripeCheckoutSession(orderId);

      const checkoutUrl = session?.checkoutUrl;

      if (
        !checkoutUrl ||
        !checkoutUrl.startsWith("https://checkout.stripe.com/")
      ) {
        throw new Error(
          "Stripe did not return a valid checkout URL. Please try again."
        );
      }

      window.location.assign(checkoutUrl);
    } catch (err) {
      console.error("Checkout payment error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start your payment. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!lines.length && !pendingOrder) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-stone-900">
          Your cart is empty
        </h1>

        <p className="mt-2 text-sm text-stone-500">
          Add some pieces to your cart before checking out.
        </p>

        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white"
        >
          Explore collection
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
          ADYA / Checkout
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-stone-900">
          Complete your order
        </h1>

        <p className="mt-2 text-sm text-stone-500">
          Confirm your delivery details and review your order.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {loadingAddresses ? (
            <div className="rounded-2xl border border-stone-200 p-6 text-sm text-stone-500">
              Loading your saved addresses...
            </div>
          ) : (
            <CheckoutAddress
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={handleAddressSelect}
              onAddressesChange={setAddresses}
            />
          )}

          <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
              Step 3
            </p>

            <h2 className="mt-1 text-xl font-semibold text-stone-900">
              Payment
            </h2>

            <div className="mt-4 rounded-xl bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-800">
                Secure online payment
              </p>

              <p className="mt-1 text-sm leading-6 text-stone-500">
                You will be redirected to Stripe's secure checkout page to
                complete your payment. Your order will only be confirmed
                after the payment is verified.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={
              placingOrder ||
              loadingAddresses ||
              loadingShipping ||
              !selectedAddress ||
              shippingChargeAUD === null ||
              !lines.length
            }
            className="w-full rounded-lg bg-stone-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placingOrder
              ? "Redirecting to secure payment..."
              : pendingOrder
                ? "Retry payment"
                : "Continue to payment"}
          </button>

          <p className="text-center text-xs leading-5 text-stone-500">
            Your payment is processed securely by Stripe. Your order is not
            marked as paid until Stripe confirms the transaction.
          </p>
        </div>

        <div className="lg:sticky lg:top-24">
          <CheckoutOrderSummary
            lines={lines}
            formatPrice={formatOrderPrice}
            shippingChargeAUD={shippingChargeAUD}
            currency={orderCurrency}
            loadingShipping={loadingShipping}
          />
        </div>
      </div>
    </main>
  );
}
