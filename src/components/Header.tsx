import React, {useState} from "react";
import {formatNumber, formatRawAmount} from "../utils/convert";
// import Web3Status from "./Web3Status";
import {useSEIBalance} from "../hooks/useBalance";
import {useSeiAddress} from "../hooks/useSeiAddress.ts";
import {Navigation} from "./Navigation";
import {Bars3Icon} from '@heroicons/react/24/solid'
import useIsMobile from "../hooks/useIsMobile";
import {useAccount, useChainId} from "wagmi";
import ConnectWalletButton from "./ConnectWalletButton";

export const Header = () => {
    const chainId = useChainId()
    const account = useAccount()
    // const {seiAddress, loading} = useSeiAddress()
    // const seiBalance = useSEIBalance()
    const isMobile = useIsMobile()
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return isMobile ?
        (
            <div className="pb-3 space-x-2">
                    <div className="flex flex-row rounded justify-between items-center">
                        <div>
                            <Bars3Icon
                                className="h-10 p-2 bg-neutral-700 text-white rounded-2xl focus:outline-none"
                                onClick={toggleMenu}
                            />
                            {isOpen && (
                                <div
                                    className={`fixed top-0 left-0 inset-0 z-30 bg-neutral-1000`}
                                    onClick={toggleMenu}
                                >
                                    <Navigation
                                        className={"h-full"}
                                    />
                                </div>
                            )}
                        </div>
                        <ConnectWalletButton />
                        {/*<Web3Status />*/}
                        {/*{account && seiAddress && !loading && (*/}
                        {/*    <div className='text-base font-medium text-center pr-4 py-2'>*/}
                        {/*        {formatNumber(formatRawAmount(seiBalance, 18))} SEI*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
            </div>
        ) : (
            <>
            <div className="flex pb-3 justify-end items-center">
                <div className='flex items-center space-x-2'>
                    <div className="flex flex-row rounded bg-neutral-800">
                        <ConnectWalletButton />
                        {/*<Web3Status />*/}
                        {/*{account  && ((chainId === ChainId.MAINNET && seiAddress && !loading) || chainId === ChainId.DEVNET) && (*/}
                        {/*    <div className='text-base font-medium text-center pr-4 py-2'>*/}
                        {/*        {formatNumber(formatRawAmount(seiBalance, 18))} SEI*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                </div>
            </div>
            </>
        )
}