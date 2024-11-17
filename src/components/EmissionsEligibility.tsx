import Typography from "./Typography";
import ProgressBar from "./ProgressBar";
import React from "react";
import {formatNumber} from "../utils/convert";
import EmissionsBar from "./EmissionsBar.tsx";

const EmissionsEligibility = ({lockedBalance, max, eligible, className = ''}) => {
    return (
        <div className={`${className} p-[24px] space-y-8`}>
            <div className={'flex items-center justify-between text-start'}>
                <Typography variant='h4'>
                    Your Emissions Eligibility
                </Typography>
            </div>
            <div className={'flex justify-between text-start'}>
                <div className={'inline-flex space-x-6'}>
                    <div className={'w-[60px] h-[60px] p-4 flex justify-center items-center rounded bg-neutral-500'}>
                        <img src={'/images/locked-icon.svg'} alt={"locked-icon"}/>
                    </div>
                    <div>
                        <div className={'text-white text-opacity-50 text-left text-sm'}>
                            Locked Balance
                        </div>
                        <div className={'text-left text-2xl'}>
                            {formatNumber(lockedBalance, true)}
                        </div>
                    </div>
                </div>
                <div className={'flex items-center justify-center pr-10'}>
                    {eligible ? (
                        <Typography className={'text-green-600'} variant='h3'>
                            Active
                        </Typography>
                    ) : (
                        <Typography className={'text-red-600'} variant='h3'>
                            Inactive
                        </Typography>
                    )
                    }
                </div>
            </div>
            <EmissionsBar
                lockedBalance={lockedBalance}
                max={max}
            />
        </div>
    )
}

export default EmissionsEligibility