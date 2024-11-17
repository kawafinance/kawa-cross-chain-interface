import React, {useEffect, useRef, useState} from 'react'
import LeaderboardRow from "./LeaderboardRow";
import Spinner from "../Spinner";
import {formatNumber} from "../../utils/convert";
import useIsMobile from "../../hooks/useIsMobile";
import {useAccount, useChainId} from "wagmi";

const Leaderboard = ({data, loading}) => {
    const {address} = useAccount()
    const parentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);
    const isMobile = useIsMobile()

    const userPosition = data.findIndex(item => item.account === address?.toLowerCase());
    const height = data.length > 0 ? 'h-full' : ''

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                setMaxHeight(entry.contentRect.height);
            }
        });

        if (parentRef.current) {
            resizeObserver.observe(parentRef.current!);
        }

        return () => {
            if (parentRef.current) {
                resizeObserver.unobserve(parentRef.current!);
            }
        };
    }, []);

    return (
        <div className={`bg-neutral-800 p-2 md:p-6 w-full ${height} rounded-3xl space-y-2 border overflow-hidden`}
             ref={parentRef}>
            <div className={'flex justify-between'}>
                <h2 className="text-xl mb-4">Leaderboard</h2>
                {userPosition > -1 ? (
                    <div className={'flex items-center gap-4'}>
                        {!isMobile && (<div className={'text-white text-opacity-30 font-semibold'}>Your Position:</div>)}
                        <div
                            className={'text-transparent bg-clip-text bg-gradient-to-r from-beam-primary-300 to-sky-blue'}>#{userPosition + 1}</div>
                        {!isMobile && (<div className={'text-white text-opacity-30 font-semibold'}>Total Points:</div>)}
                        <div
                            className={'text-transparent bg-clip-text bg-gradient-to-r from-beam-primary-300 to-sky-blue'}>{formatNumber(data[userPosition]?.totalPoints, false, false)}</div>
                    </div>
                )
                    // : data.length > 0 ?
                    // address ? (
                    //     <span className={'md:inline leading-8 tracking-normal'}>
                    //         Supply or Borrow to gain points
                    //     </span>
                    // ) : (
                    //     <span className={'md:inline leading-8 tracking-normal'}>
                    //         Connect your wallet to see your Position
                    //     </span>
                    // )
                : (
                    <></>
                )}
            </div>
            <div className="min-w-full md:p-5">
                <div
                    className="grid grid-cols-3 md:grid-cols-11 mb-4 ml-4 mr-6 text-white text-opacity-30 font-semibold">
                    <div className={'col-span-1 text-start'}>{isMobile ? 'Rank' : 'Ranking'}</div>
                    <div className="col-span-1 md:col-span-2 pl-3 md:pl-0">Wallet</div>
                    {!isMobile && (
                        <>
                            <div className="col-span-2 text-end">Supply Points</div>
                            <div className="col-span-2 text-end">Borrow Points</div>
                            <div className="col-span-2 text-end">Seiyan LP Points</div>
                        </>
                    )}
                    <div className="col-span-1 md:col-span-2 text-end">Total Points</div>
                </div>
                {data.length > 0 ? (
                    <div style={{maxHeight: `${maxHeight - 140}px`, overflowY: 'auto'}} className={'space-y-2.5'}>
                        {/*{data?.slice(0, 100).map((entry, index) => (*/}
                        {data?.map((entry, index) => (
                            <LeaderboardRow key={index} entry={entry} position={index + 1}/>
                        ))}
                    </div>

                ) : (
                    <Spinner className={'w-full h-full flex items-center pt-8'} width={40} height={40}/>
                )}
            </div>
        </div>
    )
}

export default Leaderboard
