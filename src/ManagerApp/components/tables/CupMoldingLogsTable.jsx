const CupMoldingLogsTable = ({ data, safeTimestamp }) => (
    <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', color: '#000' }}>
        <thead style={{ backgroundColor: '#97BC62' }}>
            <tr>
                <th>Timestamp</th>
                <th>Shift</th>
                <th>Operator</th>
                <th>Cavity</th>
                <th>Sheet Used</th>
                <th>Sheet Consumed</th>
                <th>Cups Produced</th>
                <th>Rejected Cups</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, i) => (
                <tr key={i}>
                    <td>{safeTimestamp(item.timestamp)}</td>
                    <td>{item.shift || '-'}</td>
                    <td>{item.operator || '-'}</td>
                    <td>
                        {item.specs && item.specs.Label
                            ? `${item.specs.Label} ${item.specs['Volume (ml)']}`
                            : item.cavity || '-'}
                    </td>
                    <td>{item.sheet_used || '-'}</td>
                    <td>{item.sheet_consumed || '-'}</td>
                    <td>{item.cups_produced || '-'}</td>
                    <td>{item.rejected_cups || '-'}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

export default CupMoldingLogsTable
