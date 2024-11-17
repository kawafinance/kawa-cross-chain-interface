import React, {useEffect, useState} from 'react'
import useFuse from '../../hooks/useFuse'
import List from '../../components/List/List'

import {useFarms, useUserInfo} from "../../hooks/useLendFarms";
import Banner from "../../components/Banner";
import Portfolio from "../../components/Portfolio";
import {TYPES} from "../panel";
import {useSeiAddress} from "../../hooks/useSeiAddress.ts";
import {useAccount, useChainId, useSwitchChain} from "wagmi";
import {ChainId} from "../../constants/chains.ts";

export default function Lend(): JSX.Element {
    const account = useAccount()
    const {seiAddress} = useSeiAddress()
    const chainId = useChainId()

    const farms = useFarms()
    const userInfo = useUserInfo()
    const { switchChain } = useSwitchChain()

    const [isVisibleBanner, setIsVisibleBanner] = useState(false)
    const [sentSwitchChain, setSentSwitchChain] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('bannerClosed') === 'true') {
            setIsVisibleBanner(false);
        }else{
            setIsVisibleBanner(true);
        }
    }, []);
    //
    // useEffect(() => {
    //     if (!sentSwitchChain && chainId !==  ChainId.SEPOLIA) {
    //         try{
    //             switchChain({ chainId: ChainId.SEPOLIA })
    //             setSentSwitchChain(true)
    //         }catch (e){
    //             console.error(e)
    //         }
    //     }
    // }, [chainId, switchChain]);

    const {result, term, search} = useFuse({
        data: farms,
        options: {
            keys: ['pair.stakingPool.symbol', 'pair.rewardToken.symbol', 'pair.stakingPool.name', 'pair.rewardToken.name'],
            threshold: 0.4
        }
    })

    // const depositAssets = result?.filter(r => r?.borrowEnabled)
    // const borrowAssets = result?.filter(r => r?.depositEnabled)

    return (
        <div className={`grid grid-cols-12 gap-4`}>
            {isVisibleBanner && (
                <div className='col-span-12'>
                    <Banner/>
                </div>
            )}
            {account && seiAddress && (
                <div className='col-span-12 rounded-3xl'>
                    <Portfolio userInfo={userInfo}/>
                </div>
            )}
            <div className={`col-span-12 py-4 md:p-6 p-2 border rounded-3xl bg-neutral-800`}>
                <div className={'grid grid-cols-2 md:space-x-6 space-y-4 md:space-y-0'}>
                    <div className={'col-span-2 md:col-span-1'}>
                        <List farms={farms} term={term} type={TYPES.DEPOSIT}/>
                    </div>
                    <div className={'col-span-2 md:col-span-1'}>
                        <List farms={farms} term={term} type={TYPES.BORROW}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
