import React from 'react';

const LockDurationRadio = ({options, selectedOption, setSelectedOption}) => {

    const handleChange = (event) => {
        setSelectedOption(Number(event.target.value));
    };
    const reversedOptions = options?.length > 0 ? [...options].reverse() : []

    return (
        <div>
            <h3>Lock duration:</h3>
            <div className="flex flex-wrap justify-between">
                {reversedOptions?.map((option, index) => (
                    <div
                        key={index}>
                        <input
                            type="radio"
                            id={`option${index}`}
                            value={option.typeIndex}
                            checked={selectedOption === option.typeIndex}
                            onChange={handleChange}
                        />
                        <label htmlFor={`option${index}`}>{option.duration} months - {option.multiplier}x Multiplier
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LockDurationRadio;