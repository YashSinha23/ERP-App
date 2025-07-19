const CupsInventoryTable = ({ data, safeTimestamp }) => (
    <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', color: '#000' }}>
        <thead style={{ backgroundColor: '#97BC62' }}>
            <tr>
                <th>Cup Type</th>
                <th>Quantity</th>
                <th>Last Updated</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, i) => (
                <tr key={i}>
                    <td>
                        {item.specs && item.specs.Label
                            ? `${item.specs.Label} ${item.specs['Volume (ml)']}`
                            : item.id || '-'}
                    </td>
                    <td>{item.quantity || '-'}</td>
                    <td>{safeTimestamp(item.last_updated)}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

export default CupsInventoryTable
