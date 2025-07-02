// /Filters.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


const Filters = ({ selectedCategory, onFilterChange }) => {
    const [filters, setFilters] = useState({});
    const [dropdownOptions, setDropdownOptions] = useState({});

    // Fetch dropdown values from Firestore
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const snapshot = await getDocs(collection(db, selectedCategory));
                const allData = snapshot.docs.map(doc => doc.data());

                const extractUnique = (field) => [...new Set(allData.map(d => d[field]).filter(Boolean))];

                let options = {};

                if (selectedCategory === "raw_material_logs") {
                    options.material_type = extractUnique("material_type");
                    options.operation = extractUnique("operation");
                } else if (selectedCategory === "sheet_forming_logs") {
                    options.operator = extractUnique("operator");
                    options.shift = extractUnique("shift");
                    options.size = extractUnique("size");
                    options.thickness = extractUnique("thickness");
                } else if (selectedCategory === "cup_molding_logs") {
                    options.operator = extractUnique("operator");
                    options.shift = extractUnique("shift");
                    options.cavity = extractUnique("cavity");
                    options.sheet_used = extractUnique("sheet_used");
                } else if (selectedCategory === "printed_cups_logs") {
                    options.operator = extractUnique("operator");
                    options.shift = extractUnique("shift");
                    options.cup_type = extractUnique("cup_type");
                }

                setDropdownOptions(options);
                setFilters({}); // reset filters when category changes
                onFilterChange({}); // notify parent
            } catch (err) {
                console.error("Failed to fetch dropdown options:", err);
            }
        };

        fetchOptions();
    }, [selectedCategory]);

    const handleChange = (field, value) => {
        let processedValue = value;

        // Coerce numeric fields
        if (["thickness", "cavity"].includes(field)) {
            processedValue = parseFloat(value);
        }

        const updated = { ...filters, [field]: processedValue };
        setFilters(updated);
        onFilterChange(updated);
    };


    return (
        <div style={{
            marginBottom: '24px',
            backgroundColor: '#e7f2dc',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
        }}>
            <h3 style={{
                marginBottom: '1rem',
                color: '#2C5F2D',
                fontSize: '20px',
                fontWeight: 'bold'
            }}>
                Filters
            </h3>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                {/* Dynamic dropdowns from Firestore */}
                {Object.entries(dropdownOptions).map(([field, values]) => (
                    <div key={field} style={{ minWidth: '180px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#2C5F2D',
                            fontWeight: '600',
                            fontSize: '14px',
                            textTransform: 'capitalize'
                        }}>
                            {field.replace(/_/g, ' ')}
                        </label>
                        <select
                            value={filters[field] || ""}
                            onChange={(e) => handleChange(field, e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                backgroundColor: '#f6fff2',
                                color: '#2C5F2D',
                                border: '1px solid #97BC62',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            <option value="">-- Select --</option>
                            {values.map((opt, idx) => (
                                <option key={idx} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                ))}

                {/* From Date Picker (MUI) */}
                <div style={{ minWidth: '180px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        color: '#2C5F2D',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}>
                        From Date
                    </label>
                    <DatePicker
                        format="YYYY-MM-DD"
                        value={filters.fromDate ? dayjs(filters.fromDate) : null}
                        onChange={(date) => handleChange("fromDate", date ? date.format('YYYY-MM-DD') : "")}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                sx: {
                                    backgroundColor: '#f6fff2',
                                    borderRadius: '8px',
                                    '& .MuiInputBase-input': {
                                        color: '#2C5F2D',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#97BC62'
                                    }
                                }
                            }
                        }}
                    />
                </div>

                {/* To Date Picker (MUI) */}
                <div style={{ minWidth: '180px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        color: '#2C5F2D',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}>
                        To Date
                    </label>
                    <DatePicker
                        format="YYYY-MM-DD"
                        value={filters.toDate ? dayjs(filters.toDate) : null}
                        onChange={(date) => handleChange("toDate", date ? date.format('YYYY-MM-DD') : "")}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                sx: {
                                    backgroundColor: '#f6fff2',
                                    borderRadius: '8px',
                                    '& .MuiInputBase-input': {
                                        color: '#2C5F2D',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#97BC62'
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );


};

export default Filters;
