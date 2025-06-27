// src/PrintButton.jsx
import { Button } from '@mui/material';
import dayjs from 'dayjs';

const PrintButton = ({ data, selectedCategory }) => {
  const handlePrint = () => {
    const isCupLog = selectedCategory === "cup_molding_logs";
    const isSheetLog = selectedCategory === "sheet_forming_logs";
    const isPrintedLog = selectedCategory === "printed_cups_logs";
    const isCupStock = selectedCategory === "cups_stock";
    const isPrintedStock = selectedCategory === "printed_cups_stock";
    const isLog = selectedCategory.includes("logs");

    const formatDate = (ts) => {
      const date = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    };

    const headers = isCupLog
      ? ["Timestamp", "Shift", "Operator", "Sheet Used", "Sheet Consumed", "Cups Produced", "Cavity"]
      : isSheetLog
      ? ["Timestamp", "Shift", "Operator", "Sheet Size", "Thickness", "Primary Material", "Additives", "Scrap (kg)", "Total Produced (kg)"]
      : isPrintedLog
      ? ["Timestamp", "Shift", "Operator", "Cup Type", "Cups Produced", "Rejected Cups"]
      : isCupStock || isPrintedStock
      ? [isPrintedStock ? "Printed Cup Type" : "Cup Type", "Quantity", "Last Updated"]
      : isLog
      ? ["Timestamp", "Material Type", "Quantity", "Operation"]
      : ["Material Type", "Quantity", "Last Updated"];

    const rows = data.map(item => {
      if (isCupLog) {
        return [
          formatDate(item.timestamp),
          item.shift || "-",
          item.operator || "-",
          item.sheet_used || "-",
          item.sheet_consumed || "-",
          item.cups_produced || "-",
          item.cavity || "-"
        ];
      } else if (isSheetLog) {
        return [
          formatDate(item.timestamp),
          item.shift || "-",
          item.operator || "-",
          item.size || "-",
          item.thickness || "-",
          item.primary_material || "-",
          item.additives ? Object.entries(item.additives).map(([k, v]) => `${k}: ${v}`).join(', ') : "-",
          item.scrap || "-",
          item.total_production || "-"
        ];
      } else if (isPrintedLog) {
        return [
          formatDate(item.timestamp),
          item.shift || "-",
          item.operator || "-",
          item.cup_type || "-",
          item.cups_produced || "-",
          item.rejected_cups || "-"
        ];
      } else if (isCupStock || isPrintedStock) {
        return [
          item.id || "-",
          item.quantity || "-",
          formatDate(item.last_updated)
        ];
      } else if (isLog) {
        return [
          formatDate(item.timestamp),
          item.material_type || "-",
          item.quantity || "-",
          item.operation || "-"
        ];
      } else {
        return [
          item.id || "-",
          item.quantity || "-",
          formatDate(item.last_updated)
        ];
      }
    });

    const htmlContent = `
      <html>
        <head>
          <title>Print Data</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #888;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #97BC62;
              color: white;
            }
            h2 {
              text-align: center;
              color: #2C5F2D;
            }
          </style>
        </head>
        <body>
          <h2>${selectedCategory.replace(/_/g, ' ').toUpperCase()}</h2>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Button
      onClick={handlePrint}
      variant="contained"
      style={{
        backgroundColor: '#2C5F2D',
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: '15px',
        borderRadius: '8px',
        marginLeft: '10px'
      }}
    >
      🖨️ Print
    </Button>
  );
};

export default PrintButton;
