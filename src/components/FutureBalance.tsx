import Typography from "./Typography";
import ProgressBar from "./ProgressBar";
import React from "react";
import {formatNumber} from "../utils/convert";

const FutureBalance = ({borrowBalance, max, className = ''}) => {
    return (
        <div className={`${className} p-[24px] space-y-8`}>
            <div className={'items-center justify-center text-start'}>
                <Typography variant='h3'>
                    Your new borrow balance
                </Typography>
            </div>
            <div className={'inline-flex space-x-6'}>
                <div className={'w-[60px] h-[60px] flex justify-center items-center rounded bg-neutral-500'}>
                    <img src={'/images/down-icon.svg'} alt={"down-icon"}/>
                </div>
                <div>
                    <div className={'text-white text-opacity-50 text-left text-sm'}>
                        Borrow Balance
                    </div>
                    <div className={'text-left text-2xl'}>
                        {formatNumber(borrowBalance, true)}
                    </div>
                </div>
            </div>
            <ProgressBar
                borrowBalance={borrowBalance}
                max={max}
            />
        </div>
    )
}

export default FutureBalance