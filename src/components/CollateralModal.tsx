import React, {useEffect, useRef} from 'react';
import {BUTTON_VARIANTS, Button} from './Button';
import ProgressBar from "./ProgressBar";
import {TYPES} from "../pages/panel";
import {useChainId} from "wagmi";
import {NATIVE_CHAIN_ID} from "../constants/contracts.ts";
import {useSwitchChain} from "wagmi";

const CollateralModal = ({isOpen, onClose, onConfirm, type, futureBorrowBalance, futureMax}) => {
    const modalContentRef = useRef<HTMLDivElement | null>(null);
    const isEnable = type === TYPES.ENABLE_COLLATERAL
    const chainId = useChainId()
    const {switchChain} = useSwitchChain()

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current?.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;


    return (
        <div className="fixed top-16 left-0 w-full h-full flex justify-center bg-opacity-50 bg-neutral-1000 z-50">
            <div ref={modalContentRef}
                 className="bg-neutral-800 rounded-2xl w-[580px] h-[360px] p-10 border border-neutral-600 space-y-8"
            >{chainId === NATIVE_CHAIN_ID
                ? (<>
                    <div className="font-sans text-xl font-semibold leading-8 tracking-tight text-center">
                        Your new limit
                    </div>
                    <div className="font-sans font-semibold leading-8 tracking-tight text-center">
                        <div
                            className={`bg-neutral-800 rounded-3xl space-y-8 flex flex-col justify-center items-center`}>

                            <ProgressBar
                                className={'w-[430px]'}
                                borrowBalance={futureBorrowBalance}
                                max={futureMax}
                            />
                            <Button
                                className={'w-[200px] h-[60px] rounded'}
                                variant={BUTTON_VARIANTS.EMPTY}
                                disabled={chainId !== NATIVE_CHAIN_ID}
                                onClick={() => onConfirm()}
                            >
                                {isEnable ? 'Enable' : 'Disable'}
                            </Button>
                        </div>
                    </div>
                </>) : (
                    <div className={`flex justify-center items-center h-full w-full`}>
                        <Button
                            className={'w-[200px] h-[60px] rounded'}
                            variant={BUTTON_VARIANTS.EMPTY}
                            onClick={() => switchChain({chainId: NATIVE_CHAIN_ID})}
                        >
                            {'Switch Network'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
};

export default CollateralModal;