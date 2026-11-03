
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Releasing your reserved stock...");

  useEffect(() => {
    let active = true;

    async function cancelCheckout() {
      if (!orderId) {
        setStatus("error");
        setMessage("Order ID is missing.");
        return;
      }

      try {
        const response = await api.post(
          "/payment-transactions/cancel-checkout",
          { orderId }
        );

        if (!active) return;

        setStatus("success");
        setMessage(
          response.data?.data?.message ||
          "Your checkout was cancelled."
        );
      } catch (error) {
        if (!active) return;

        setStatus("error");
        setMessage(
          error.response?.data?.message ||
          "We couldn't confirm the cancellation. Please check your payment status before trying again."
        );
      }
    }

    cancelCheckout();

    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">
          {status === "processing"
            ? "Processing cancellation"
            : status === "success"
            ? "Checkout cancelled"
            : "Cancellation needs attention"}
        </h1>

        <p className="mb-6 text-gray-600">{message}</p>

        {status === "processing" && (
          <p className="text-sm text-gray-500">
            Please wait...
          </p>
        )}

        {status !== "processing" && (
          <Link
            to="/"
            className="inline-block rounded-lg bg-[#641d2d] px-6 py-3 text-white"
          >
            Return to Store
          </Link>
        )}
      </div>
    </main>
  );
}
