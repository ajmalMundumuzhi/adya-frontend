
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Invoice from "../components/invoice/Invoice";
import { getMyOrderById } from "../services/orders.service";

export default function CustomerInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load invoice"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (loading) {
    return (
      <div className="px-5 py-20 text-center text-sm text-[#493829]/65">
        Loading invoice...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="px-5 py-20 text-center">
        <p className="text-sm text-red-600">
          {error || "Order not found"}
        </p>
        <button
          type="button"
          onClick={() => navigate("/account")}
          className="mt-5 bg-[#493829] px-5 py-3 text-sm text-white"
        >
          Back to account
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <Invoice
        order={order}
        onBack={() => navigate("/account")}
      />
    </div>
  );
}
