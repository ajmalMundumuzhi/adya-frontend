
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("checking");
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    let active = true;

    async function verifyPayment() {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        const response = await api.get(
          `/payment-transactions/session/${sessionId}`
        );

        if (!active) return;

        const data = response.data?.data;
        setPayment(data);

        if (data?.status === "succeeded") {
          setStatus("success");
        } else if (
          ["failed", "cancelled"].includes(data?.status)
        ) {
          setStatus("failed");
        } else {
          setStatus("pending");
        }
      } catch {
        if (active) setStatus("error");
      }
    }

    verifyPayment();

    return () => {
      active = false;
    };
  }, [sessionId]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        {status === "checking" && (
          <>
            <h1 className="mb-3 text-2xl font-semibold">
              Verifying your payment
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your payment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-5 text-5xl text-green-600">✓</div>
            <h1 className="mb-3 text-2xl font-semibold text-gray-900">
              Payment Successful!
            </h1>
            <p className="mb-4 text-gray-600">
              Thank you for shopping with ADYA. Your order has been confirmed.
            </p>
            <p className="mb-6 text-sm text-gray-500">
              Order ID: {payment?.orderId}
            </p>
            <Link
              to="/"
              className="inline-block rounded-lg bg-[#641d2d] px-6 py-3 text-white"
            >
              Continue Shopping
            </Link>
          </>
        )}

        {status === "pending" && (
          <>
            <h1 className="mb-3 text-2xl font-semibold">
              Payment Processing
            </h1>
            <p className="mb-6 text-gray-600">
              Your payment is being verified. Please check again shortly.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-[#641d2d] px-6 py-3 text-white"
            >
              Check Again
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <h1 className="mb-3 text-2xl font-semibold">
              Payment Not Completed
            </h1>
            <p className="mb-6 text-gray-600">
              We couldn't confirm your payment.
            </p>
            <Link to="/" className="text-[#641d2d] underline">
              Return to Store
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="mb-3 text-2xl font-semibold">
              Unable to Verify Payment
            </h1>
            <p className="mb-6 text-gray-600">
              Please contact our support team before attempting another payment.
            </p>
            <Link to="/" className="text-[#641d2d] underline">
              Return to Store
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
