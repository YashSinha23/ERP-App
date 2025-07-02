const RawMaterialLogsTable = ({ data, safeTimestamp }) => (
    <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', color: '#000' }}>
        <thead style={{ backgroundColor: '#97BC62' }}>
            <tr>
                <th>Timestamp</th>
                <th>Material Type</th>
                <th>Quantity</th>
                <th>Operation</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, i) => (
                <tr key={i}>
                    <td>{safeTimestamp(item.timestamp)}</td>
                    <td>{item.material_type || '-'}</td>
                    <td>{item.quantity || '-'}</td>
                    <td>{item.operation || '-'}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

export default RawMaterialLogsTable
