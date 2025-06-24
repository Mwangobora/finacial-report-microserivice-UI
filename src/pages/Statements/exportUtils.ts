import React from "react"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function downloadAsFile(filename: string, content: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}

export function printStatementSection(htmlId: string, name: string) {
  const input = document.getElementById(htmlId);
  if (!input) return;
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write('<html><head><title>' + name + '</title>');
    printWindow.document.write('</head><body>' + input.innerHTML + '</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
}

export async function downloadAsPDF(htmlId: string, filename: string) {
  const input = document.getElementById(htmlId);
  if (!input) return;
  const canvas = await html2canvas(input, { scale: 2 } as any);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 40;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
  pdf.save(filename);
}
