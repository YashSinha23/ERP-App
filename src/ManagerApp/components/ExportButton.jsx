// src/ExportButton.jsx
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

const ExportButton = ({ data, collectionName }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No data to export.");
      return;
    }

    const sheet = XLSX.utils.json_to_sheet(
      data.map(d => ({
        ...d,
        timestamp: dayjs(d.timestamp?.seconds ? d.timestamp.seconds * 1000 : d.timestamp).format('YYYY-MM-DD HH:mm:ss')
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Filtered Logs');

    const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([blob]), `${collectionName}_filtered.xlsx`);
  };

  return (
    <Button
      onClick={handleExport}
      variant="contained"
      style={{
        backgroundColor: '#2C5F2D',
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: '15px',
        borderRadius: '8px'
      }}
    >
      📤 Export
    </Button>
  );
};

export default ExportButton;
