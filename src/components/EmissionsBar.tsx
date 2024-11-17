import React, {useCallback, useMemo, useState} from 'react';
import {formatNumber, formatPercent} from "../utils/convert";
import Tippy from "@tippyjs/react";

const EmissionsBar = ({lockedBalance, max, className = ''}) => {

    const limit = max
    const [show, setShow] = useState<boolean>(false)

    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    const percentage = useMemo(() =>
            lockedBalance > 0 && max > 0
                ? Math.min(lockedBalance / max * 100, 100)
                : 0
        , [lockedBalance, max])

    const threshold = limit / max * 100 > 0 ? limit / max * 100 : 97

    const warn = threshold - 10
    const limitFormatted = formatNumber(limit, true)
    const maxFormatted = formatNumber(max, true)
    const borrowBalanceFormatted = formatNumber(lockedBalance, true)

    return (
        <>
            <div
                className={`${className} space-y-3`}
                onClick={open}
                onMouseEnter={open}
                onMouseLeave={close}
            >
                <div className={'relative w-full'}>
                <span className={'text-white text-opacity-50 text-left'}>
                    Locked KLP
                </span>
                    {/*    <span className={`absolute`}*/}
                    {/*          style={{left: `${threshold - 2.5}%`}}*/}
                    {/*    >*/}
                    {/*    {limitFormatted}*/}
                    {/*</span>*/}
                </div>
                <div
                    className={'h-[20px]'}
                >
                    {/*<Tippy content={*/}
                    {/*    <div*/}
                    {/*        className={'rounded p-4 bg-gradient-to-r from-beam-primary-300-g to-sky-blue-g text-black'}>*/}
                    {/*        This bar displays your liquidation threshold ({maxFormatted}). You can borrow up*/}
                    {/*        to {limitFormatted}. If you reach your liquidation threshold*/}
                    {/*        (100%), some or all of your collateral may be liquidated.*/}
                    {/*    </div>*/}
                    {/*}>*/}
                        <div className="relative w-full h-[20px] bg-white bg-opacity-30 rounded">
                            <div
                                className={`absolute rounded left-0 top-0 h-full bg-gradient-to-r from-beam-primary-300 to-sky-blue`}
                                style={{width: `${percentage}%`}}/>
                            {percentage > warn && (
                                <div
                                    className="absolute rounded right-0 top-0 h-full bg-gradient-to-r from-transparent to-negative opacity-75"
                                    style={{left: `${warn}%`, width: `${percentage - warn}%`}}
                                />
                            )}
                            {/*<div className="absolute top-[-9px] bottom-[-9px] w-[0.25px] bg-white bg-opacity-50"*/}
                            {/*     style={{left: `${threshold}%`}}/>*/}
                            {/*<div className="absolute top-0 bottom-0 bg-white bg-opacity-50 rounded-r"*/}
                            {/*     style={{left: `${threshold}%`, width: `${100 - threshold}%`}}/>*/}
                            <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold leading-none">
                            {formatPercent(percentage)}
                        </span>
                            </div>
                        </div>
                    {/*</Tippy>*/}
                </div>
                <div className={'text-white text-opacity-50 text-left'}>
                    {borrowBalanceFormatted} of {maxFormatted}
                </div>
            </div>
        </>
    );
};

export default EmissionsBar;