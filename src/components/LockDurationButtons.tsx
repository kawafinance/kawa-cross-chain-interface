import React, {useState} from 'react';
import {Button, BUTTON_VARIANTS} from "./Button.tsx";
import {formatTime} from "../utils/format.ts";

const LockDurationButtons = ({options, selectedOption, setSelectedOption}) => {

    const handleChange = (typeIndex) => {
        setSelectedOption(Number(typeIndex));
    };
    const reversedOptions = options?.length > 0 ? [...options].reverse() : []

    return (
        <div>
            {/*<h3>Lock duration</h3>*/}
            <div className="flex flex-wrap justify-between gap-4">
                {reversedOptions?.map((option, index) => (
                    <Button
                        key={index}
                        onClick={() => handleChange(option.typeIndex)}
                        className={'h-[60px] w-[160px] rounded'}
                        variant={selectedOption === option.typeIndex ? BUTTON_VARIANTS.FILLED : BUTTON_VARIANTS.EMPTY}
                    >
                        {formatTime(option.duration)}<br />
                        {option.multiplier}x Multiplier
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default LockDurationButtons;