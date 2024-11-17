import {formatNumber, formatWallet} from "../../utils/convert";
import React from "react";
import useIsMobile from "../../hooks/useIsMobile";
import {useAccount} from "wagmi";

const LeaderboardRow = ({position, entry}) => {
    const {address} = useAccount()
    const isMobile = useIsMobile()
    const userClassName = entry.account === address?.toLowerCase() ? 'text-transparent bg-clip-text bg-gradient-to-r from-beam-primary-300 to-sky-blue' : ''

    return (
        <div className="min-w-full bg-neutral-700 rounded-3xl p-4 gap-4">
            <div className={`grid grid-cols-3 md:grid-cols-11 items-center font-bold ${userClassName}`}>
                <div
                    className="col-span-1 bg-neutral-500 rounded-2xl w-[40px] h-[40px] flex justify-center items-center">
                    <span className={userClassName}>
                    {position}
                    </span>
                </div>
                <div className="col-span-1 md:col-span-2 pl-3 md:pl-0">
                    <a href={`https://seitrace.com/address/${entry.account}`} target={"_blank"}>
                        {formatWallet(entry.account, isMobile)}
                    </a>
                </div>
                {!isMobile && (
                    <>
                        <div className="col-span-2 text-end">{formatNumber(entry.supplyPoints, false, false)}</div>
                        <div className="col-span-2 text-end">{formatNumber(entry.borrowPoints, false, false)}</div>
                        <div className="col-span-2 text-end">{formatNumber(entry.seiyanPoints, false, false)}</div>
                    </>
                )}
                <div className="col-span-1 md:col-span-2 text-end">{formatNumber(entry.totalPoints, false, false)}</div>
            </div>
        </div>
    )
}

export default LeaderboardRow