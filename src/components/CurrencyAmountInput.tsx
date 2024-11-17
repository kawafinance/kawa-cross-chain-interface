import NumericalInput from "./NumericalInput";
import React from "react";
import {formatNumber} from "../utils/convert";
import useIsMobile from "../hooks/useIsMobile";

export const CurrencyAmountInput = ({symbol, amount, balance, balanceLabel, onUserInput, className}) => {
    const isMobile = useIsMobile()

    const icon = `/images/${symbol?.toLowerCase()}.svg`
    return (
        <>
            <div className={`flex items-center justify-center ${className}`}>
                <div className={'inline-flex space-x-6'}>
                    <img src={icon} alt={"currency"}
                         className={'w-[54px] h-[50px]'}/>
                    <div>
                        <div className={'text-white text-left text-lg'}>
                            {symbol}
                        </div>
                        <div className={'text-left text-opacity-50 text-sm whitespace-nowrap'}
                        >
                            {isMobile ? `${formatNumber(balance)}` : `${balanceLabel}: ${formatNumber(balance)}`}
                        </div>
                    </div>
                </div>
                <NumericalInput
                    value={amount}
                    onUserInput={onUserInput}
                    className={'w-full p-0 text-2xl text-right bg-transparent'}
                />
            </div>
        </>
    )
}