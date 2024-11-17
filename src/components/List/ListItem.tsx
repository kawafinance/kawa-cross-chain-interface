import {formatNumber, formatPercent} from '../../utils/convert'
import React, {useState} from 'react'
import {TYPES} from "../../pages/panel";
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/24/solid'
import ListItemDetails from "./ListItemDetails";
import {useSeiAddress} from "../../hooks/useSeiAddress.ts";
import {ChainId} from "../../constants/chains";
import {useAccount, useChainId} from "wagmi";
import useIsMobile from "../../hooks/useIsMobile.ts";
import Tippy from "@tippyjs/react";
import {QuestionMarkCircleIcon} from '@heroicons/react/24/outline'

const ListItem = ({farm, type}) => {
    const chainId = useChainId()
    const account = useAccount()
    const {seiAddress, loading} = useSeiAddress()
    const isMobile = useIsMobile()
    const [openDetails, setOpenDetails] = useState(false)
    const error = !((account && seiAddress && !loading))
    const handleOpenDetails = () => {
        if (!error) setOpenDetails(prev => !prev)
    }

    const icon = `/images/${farm?.underlyingSymbol?.toLowerCase()}.svg`

    const InfoTippy = ({className}) => {
        const label = type == TYPES.DEPOSIT ? 'Supply APY' : 'Borrow Rate'
        const labelAPY = formatPercent(type == TYPES.DEPOSIT ? farm.supplyAPY : - farm.borrowAPY)
        const rewardsAPR = formatPercent(type == TYPES.DEPOSIT ? farm.supplyRewardsAPR : farm.borrowRewardsAPR)

        return (
            <Tippy content={
                <div
                    className={'rounded p-4 bg-gradient-to-r from-beam-primary-300-g to-sky-blue-g text-black text-xxs'}>
                    <p>Projection based on estimated<br/>Token Value at TGE</p>
                    <div/>
                    <div className={'grid grid-cols-2 '}>
                        <div className={'col-span-1 font-semibold'}>
                            <div>{label}:</div>
                            <div>Rewards APR:</div>
                        </div>
                        <div className={'col-span-1 text-end'}>
                            <div>{labelAPY}</div>
                            <div>{rewardsAPR}</div>
                        </div>
                    </div>
                </div>
            }>
                <div className={className}>
                    <QuestionMarkCircleIcon/>
                </div>
            </Tippy>
        )
    }
    return (
        <div
            className={`w-full h-auto p-4 rounded-3xl gap-4 bg-neutral-700 space-y-2 ${!error ? 'cursor-pointer' : ''} select-none`}
        >
            <div
                className='flex'
                onClick={handleOpenDetails}
            >
                <div className='w-11/12'>
                    <div className='grid md:grid-cols-9 grid-cols-4'>
                        <div className="md:col-span-3 col-span-1 flex flex-row justify-content-between">
                            <div className="w-max rounded-2xl bg-neutral-500 bg-opacity-50 p-2">
                                <img src={icon} alt={farm?.underlyingSymbol} className="w-[40px] h-[40px]"/>
                            </div>
                            {!isMobile && (<div className="flex items-center pl-3 pt-3 pb-3 ">
                                <div className="font-semibold text-center">{farm?.underlyingSymbol}</div>
                            </div>)}
                        </div>
                        <div className='md:col-span-2 col-span-1 flex flex-col justify-center items-end'>
                            <div className='font-bold'>
                                {formatNumber(
                                    type == TYPES.DEPOSIT ? farm.balanceOfUnderlying : farm.borrowBalanceCurrent
                                    , false
                                )}
                            </div>
                            <div className='text-xs text-white text-opacity-50'>
                                {formatNumber(
                                    type == TYPES.DEPOSIT ? farm.balanceOfUnderlyingTVL : farm.borrowBalanceCurrentTVL
                                    , true)
                                }
                            </div>
                        </div>
                        <div className='md:col-span-2 col-span-1 flex flex-col items-end justify-center'>
                            <div className='font-bold flex justify items-center text-right text-high-emphesis'>
                                {formatNumber(
                                    type == TYPES.DEPOSIT ? farm.supply : farm.borrow
                                    , false
                                )}
                            </div>
                            <div className='text-xs flex justify items-center text-right  text-white text-opacity-50'>
                                {formatNumber(
                                    type == TYPES.DEPOSIT ? farm.supplyTVL : farm.borrowTVL
                                    , true
                                )}
                            </div>
                        </div>
                        <div className='md:col-span-2 col-span-1 flex flex-col-2 items-center justify-end'>
                            <div className='flex gap-1 font-bold text-high-emphesis items-center justify-center outline-none'>
                                <InfoTippy className={'h-4 w-4 cursor-help'}/>
                                {formatPercent(
                                    type == TYPES.DEPOSIT
                                        ? (farm.supplyAPY.toNumber() + farm.supplyRewardsAPR)
                                        : (farm.borrowRewardsAPR - farm.borrowAPY.toNumber())
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-1/12 '>
                    {!error ?
                        <button className='flex items-center justify-center h-full'>
                            {openDetails ? <ChevronUpIcon className="h-5 ml-2 text-white" aria-hidden="true"/> :
                                <ChevronDownIcon className="h-5 ml-2 text-white" aria-hidden="true"/>}
                        </button>
                        :
                        <div className={'h-5 ml-2 '}/>
                    }
                </div>
            </div>
            {(openDetails) && <ListItemDetails type={type} farm={farm}/>}
        </div>
    )
}

export default ListItem
