import React, { useState, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface DynamicSelectProps {
    fetchOptions: () => Promise<Option[]>;
    onChange?: (selected: Option) => void;
}

const DynamicSelect: React.FC<DynamicSelectProps> = ({ fetchOptions, onChange }) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>("");

    useEffect(() => {
        fetchOptions().then(data => {
            setOptions(data);
            if (data.length > 0) {
                setSelectedValue(data[0].value);
                onChange && onChange(data[0]);
            }
        });
    }, [fetchOptions, onChange]);

    return (
        <select
            value={selectedValue}
            onChange={(e) => {
                const value = e.target.value;
                setSelectedValue(value);
                const selectedOption = options.find(opt => opt.value === value);
                if (selectedOption) {
                    onChange && onChange(selectedOption);
                }
            }}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
};

export default DynamicSelect;