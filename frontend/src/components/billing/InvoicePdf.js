import jsPDF from "jspdf";

export function downloadInvoicePdf(invoice) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const billing = invoice.billingSnapshot || {};
  const margin = 20;
  let y = margin;

  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Work2Business", margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100);
  pdf.text("Invoice", margin, y);
  y += 10;

  pdf.setTextColor(0);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Invoice #${invoice.invoiceNumber}`, margin, y);
  y += 7;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Issued: ${new Date(invoice.issuedAt).toLocaleDateString()}`, margin, y);
  y += 6;
  pdf.text(`Status: ${(invoice.status || "paid").toUpperCase()}`, margin, y);
  y += 12;

  pdf.setFont("helvetica", "bold");
  pdf.text("Bill to", margin, y);
  y += 6;
  pdf.setFont("helvetica", "normal");
  [
    billing.fullName,
    billing.company,
    billing.email,
    billing.phone,
    billing.addressLine1,
    billing.addressLine2,
    [billing.city, billing.region].filter(Boolean).join(", "),
    billing.country,
    billing.taxId ? `Tax ID: ${billing.taxId}` : null
  ].filter(Boolean).forEach((line) => {
    pdf.text(String(line), margin, y);
    y += 5;
  });

  y += 8;
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", margin, y);
  pdf.text("Amount", 160, y);
  y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.text(`Founder Plan (1 year)`, margin, y);
  pdf.text(`${invoice.currency || "ETB"} ${invoice.amount?.toLocaleString()}`, 160, y);
  y += 6;
  pdf.text(`Payment method: ${invoice.method}`, margin, y);
  y += 12;

  pdf.setFont("helvetica", "bold");
  pdf.text(`Total: ${invoice.currency || "ETB"} ${invoice.amount?.toLocaleString()}`, margin, y);

  pdf.save(`${invoice.invoiceNumber}.pdf`);
}
