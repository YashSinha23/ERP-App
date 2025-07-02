const PrintedCupsLogsTable = ({ data, safeTimestamp }) => (
    <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', color: '#000' }}>
        <thead style={{ backgroundColor: '#97BC62' }}>
            <tr>
                <th>Timestamp</th>
                <th>Shift</th>
                <th>Operator</th>
                <th>Cup Type</th>
                <th>Cups Produced</th>
                <th>Rejected Cups</th>
                <th>Printing Label</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, i) => (
                <tr key={i}>
                    <td>{safeTimestamp(item.timestamp)}</td>
                    <td>{item.shift || '-'}</td>
                    <td>{item.operator || '-'}</td>
                    <td>{item.cup_type || '-'}</td>
                    <td>{item.cups_produced || '-'}</td>
                    <td>{item.rejected_cups || '-'}</td>
                    <td>{item.printing_label || '-'}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

export default PrintedCupsLogsTable
