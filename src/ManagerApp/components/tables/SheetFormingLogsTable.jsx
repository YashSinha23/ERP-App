const SheetFormingLogsTable = ({ data, safeTimestamp }) => (
    <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', color: '#000' }}>
        <thead style={{ backgroundColor: '#97BC62' }}>
            <tr>
                <th>Timestamp</th>
                <th>Shift</th>
                <th>Operator</th>
                <th>Sheet Size</th>
                <th>Thickness</th>
                <th>Primary Material</th>
                <th>Additives</th>
                <th>Gola Scrap (kg)</th>
                <th>Sheet Scrap (kg)</th>
                <th>Usable Sheet (kg)</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, i) => (
                <tr key={i}>
                    <td>{safeTimestamp(item.timestamp)}</td>
                    <td>{item.shift || '-'}</td>
                    <td>{item.operator || '-'}</td>
                    <td>{item.size || '-'}</td>
                    <td>{item.thickness || '-'}</td>
                    <td>{item.primary_material || '-'}</td>
                    <td>
                        {item.additives
                            ? Object.entries(item.additives).map(([k, v]) => `${k}: ${v}`).join(', ')
                            : '-'}
                    </td>
                    <td>{item.gola_scrap || '-'}</td>
                    <td>{item.sheet_scrap || '-'}</td>
                    <td>{item.sheet_usable || '-'}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

export default SheetFormingLogsTable
