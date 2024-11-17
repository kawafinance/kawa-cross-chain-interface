import React from "react";

export const ChartInfo = ({label, value1, value2, className}) =>{
    return (
        <div className={'inline-flex space-x-6'}>
            <div
                className={'w-[54px] h-[54px] flex justify-center items-center rounded bg-neutral-500 p-4'}>
                <div className={`${className} w-[16px] h-[16px] rounded-sm`} />
            </div>
            <div>
                <div className={'text-white text-opacity-50 text-left text-sm'}>
                    {label}
                </div>
                <div className={'text-left text-2xl'}>
                    {value1}
                </div>
                <div className={'text-white text-opacity-50 text-left text-sm'}>
                    {value2}
                </div>
            </div>
        </div>
    )
}