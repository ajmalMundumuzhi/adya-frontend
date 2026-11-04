
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Invoice from "../../components/invoice/Invoice";
import { getOrderById } from "../../services/admin/orders.service";

export default function AdminInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(err.message || "Unable to load invoice");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-[#927e6e]">
        Loading invoice...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-10 space-y-4 text-center">
        <p className="text-sm text-red-600">
          {error || "Order not found"}
        </p>
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="rounded-lg bg-[#5b302e] px-5 py-3 text-sm text-white"
        >
          Back to orders
        </button>
      </div>
    );
  }

  return (
    <Invoice
      order={order}
      onBack={() => navigate(`/admin/orders/${id}`)}
    />
  );
}
