
import { useRef, useState } from "react";
import { ArrowLeft, Download, Printer } from "lucide-react";

function formatMoney(amount, currency = "AUD") {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency
    }).format(Number(amount || 0));
  } catch {
    return `${currency} ${Number(amount || 0).toFixed(2)}`;
  }
}

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

function getAddressLines(address) {
  if (!address) return [];

  if (typeof address === "string") {
    return [address];
  }

  return [
    address.fullName,
    address.phone,
    address.addressLine1,
    address.addressLine2,
    [address.city, address.state, address.postalCode]
      .filter(Boolean)
      .join(", "),
    address.country
  ].filter(Boolean);
}

export default function Invoice({ order, onBack }) {
  const invoiceRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const currency = order.currency || "AUD";
  const items = order.items || [];
  const shippingAddress = getAddressLines(order.shippingAddress);

  const subtotal = Number(order.subtotal ?? 0);
  const shipping = Number(order.shippingCharge ?? 0);
  const total = Number(order.totalAmount ?? 0);

  const invoiceNumber =
    order.orderNumber || order._id?.slice(-8).toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!invoiceRef.current || downloading) return;

    setDownloading(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename: `ADYA-Invoice-${invoiceNumber}.pdf`,
          image: {
            type: "jpeg",
            quality: 0.98
          },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
          },
          pagebreak: {
            mode: ["css", "legacy"]
          }
        })
        .from(invoiceRef.current)
        .save();
    } catch (error) {
      console.error("Invoice PDF download failed:", error);
      window.alert("Unable to download the invoice. Please try printing it instead.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-[#e9e1d7] bg-white px-4 py-2.5 text-sm text-[#624b40] hover:bg-[#faf8f4]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-[#dff7ef] px-5 py-3 text-sm font-semibold text-[#244b40] hover:bg-[#c9f0e4]"
          >
            <Printer size={17} />
            Print
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#51cfae] px-5 py-3 text-sm font-semibold text-white hover:bg-[#39b998] disabled:opacity-60"
          >
            <Download size={17} />
            {downloading ? "Preparing PDF..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div
        ref={invoiceRef}
        className="invoice-document bg-white p-5 text-[#242424] shadow-sm sm:p-10 lg:p-14"
      >
        <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div>
            <h1 className="font-serif text-4xl font-semibold tracking-[0.15em] text-[#8b7047]">
              ADYA
            </h1>
            <p className="mt-1 text-xs tracking-[0.25em] text-[#8b7047]">
              HERITAGE & ELEGANCE
            </p>
          </div>

          <div className="text-sm sm:text-right">
            <p>
              <strong>Invoice Date: </strong>
              {formatDate(order.createdAt)}
            </p>
            <p className="mt-1 break-all">
              <strong>Invoice No: </strong>
              #{invoiceNumber}
            </p>
          </div>
        </header>

        <div className="mt-12">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px border-t border-gray-300 border-dashed" />
            <h2 className="text-xl font-medium tracking-wide text-[#51cfae]">
              INVOICE
            </h2>
            <div className="flex-1 h-px border-t border-gray-300 border-dashed" />
          </div>
        </div>

        <section className="grid mt-8 gap-7 sm:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold">Customer</h3>
            <p>{order.customerName || "—"}</p>
            <p className="mt-1 text-sm break-all">{order.customerEmail || "—"}</p>
            <p className="mt-1 text-sm">{order.phone || "—"}</p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Billing Address</h3>
            <div className="space-y-1 text-sm italic">
              {shippingAddress.length ? (
                shippingAddress.map((line, index) => (
                  <p key={index}>{line}</p>
                ))
              ) : (
                <p>Address unavailable</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Shipping Address</h3>
            <div className="space-y-1 text-sm italic">
              {shippingAddress.length ? (
                shippingAddress.map((line, index) => (
                  <p key={index}>{line}</p>
                ))
              ) : (
                <p>Address unavailable</p>
              )}
            </div>
          </div>
        </section>

        <div className="border-t border-gray-400 border-dashed mt-9" />

        <div className="overflow-x-auto mt-7">
          <table className="w-full min-w-[650px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#f5f5f5]">
                <th className="px-3 py-4 rounded-l-lg">Sl. no</th>
                <th className="px-3 py-4">Item</th>
                <th className="px-3 py-4">Rate</th>
                <th className="px-3 py-4">Size / Colour</th>
                <th className="px-3 py-4">Qty</th>
                <th className="px-3 py-4">Image</th>
                <th className="px-3 py-4 text-right rounded-r-lg">Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                const lineTotal = Number(
                  item.subtotal ??
                  Number(item.unitPrice || 0) * Number(item.quantity || 0)
                );

                return (
                  <tr
                    key={`${item.productId || item.productName}-${index}`}
                    className="border-b border-gray-200"
                  >
                    <td className="px-3 py-4">{index + 1}</td>
                    <td className="px-3 py-4 font-medium">
                      {item.productName}
                      {item.sku && (
                        <p className="mt-1 text-xs text-gray-500">
                          SKU: {item.sku}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {formatMoney(item.unitPrice, currency)}
                    </td>
                    <td className="px-3 py-4">
                      <p>{item.selectedSize || "—"}</p>
                      <p className="text-xs text-gray-500">
                        {item.variantColor || ""}
                      </p>
                    </td>
                    <td className="px-3 py-4">{item.quantity}</td>
                    <td className="px-3 py-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName || "Product"}
                          crossOrigin="anonymous"
                          className="object-cover h-16 rounded-md w-14"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="px-3 py-4 font-medium text-right whitespace-nowrap">
                      {formatMoney(lineTotal, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <section className="w-full max-w-md ml-auto space-y-4 text-sm mt-7">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <strong>{formatMoney(subtotal, currency)}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span>Shipping</span>
            <strong>{formatMoney(shipping, currency)}</strong>
          </div>

          <div className="flex justify-between gap-4 pt-4 text-base border-t border-gray-400 border-dashed">
            <strong>Total</strong>
            <strong>{formatMoney(total, currency)}</strong>
          </div>
        </section>

        <footer className="pt-5 mt-12 text-xs text-center text-gray-500 border-t border-gray-200">
          <p>Thank you for shopping with ADYA.</p>
          <p className="mt-1">We appreciate your trust in us.</p>
        </footer>
      </div>
    </div>
  );
}
