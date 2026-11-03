import api from "./api";

export async function getShippingRate(country, city) {
  if (!country || !city) {
    throw new Error("Select a country and city to calculate shipping");
  }

  const response = await api.get("/shipping/country", {
    params: { country, city }
  });

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Unable to calculate shipping");
  }

  return response.data.data;
}

export async function getCheckoutCurrencyRate(currency) {
  const response = await api.get("/currency/rates", {
    params: { currency }
  });

  if (!response.data?.success || !response.data?.data) {
    throw new Error(response.data?.message || "Unable to load exchange rates");
  }

  return response.data.data;
}

export async function createCheckoutOrder(payload) {
  const response = await api.post("/orders", payload);

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Unable to create your order");
  }

  return response.data.data;
}

export async function createStripeCheckoutSession(orderId) {
  const response = await api.post("/payment-transactions/checkout-session", {
    orderId
  });

  if (!response.data?.success || !response.data?.data?.checkoutUrl) {
    throw new Error(
      response.data?.message || "Unable to start Stripe Checkout"
    );
  }

  return response.data.data;
}

export async function getPaymentStatus(sessionId) {
  const response = await api.get(
    `/payment-transactions/session/${encodeURIComponent(sessionId)}`
  );

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Unable to retrieve payment status");
  }

  return response.data.data;
}