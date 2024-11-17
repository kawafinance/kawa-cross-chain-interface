import React from "react";
import ProgressBar from "./ProgressBar";
import {formatNumber} from "../utils/convert"
import useIsMobile from "../hooks/useIsMobile";
import {useAccount} from "wagmi";

const Portfolio = ({userInfo}) => {
    const account = useAccount()
    const isMobile = useIsMobile()

    return (
        <div className={'w-full p-6 rounded-3xl border space-y-6 bg-neutral-800'}>
            <div className={'space-x-2 text-left'}>
                <span className={'md:inline text-xl leading-8 tracking-normal'}>
                    Portfolio
                </span>
            </div>

            {account ? (
                <div className={'inline-flex flex-nowrap justify-between space-x-6 w-full'}>
                    {!isMobile && (<div className={'inline-flex space-x-6'}>
                        <div
                            className={'w-[60px] h-[60px] flex justify-center items-center rounded bg-neutral-500'}>
                            <img src={'/images/down-icon.svg'} alt={"down-icon"}/>
                        </div>
                        <div>
                            <div className={'text-white text-opacity-50 text-left text-sm'}>
                                Deposit Balance
                            </div>
                            <div className={'text-left text-2xl'}>
                                {formatNumber(userInfo?.supplyBalance, true)}
                            </div>
                        </div>
                    </div>)}
                    <div className={`space-x-1 space-y-3 ${isMobile ? 'w-full' : 'w-[50%]'}`}>
                        <ProgressBar
                            borrowBalance={userInfo?.borrowBalance}
                            max={userInfo?.totalAvailable}
                        />
                    </div>
                    {!isMobile && (<div className={'inline-flex space-x-6'}>
                        <div>
                            <div className={'text-white text-opacity-50 text-right text-sm'}>
                                Borrow Balance
                            </div>
                            <div className={'text-right text-2xl'}>
                                {formatNumber(userInfo?.borrowBalance, true)}
                            </div>
                        </div>
                        <div
                            className={'w-[60px] h-[60px] flex justify-center items-center rounded bg-neutral-500'}>
                            <img src={'/images/up-icon.svg'} alt={"down-icon"}/>
                        </div>
                    </div>
                    )}
                </div>
            ) : (
                <div className={'flex flex-col space-y-4 items-center'}>
                    <div className={'text-left'}>
                    {/*        <span className={'md:inline leading-8 tracking-normal'}>*/}
                    {/*            Connect your wallet to see your Portfolio.*/}
                    {/*        </span>*/}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Portfolio