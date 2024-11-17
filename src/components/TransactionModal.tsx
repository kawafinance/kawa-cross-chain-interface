import React, {useEffect, useRef} from 'react';
import {BUTTON_VARIANTS, Button} from './Button';
import {capitalizeFirstLetter, shortenTransactionID} from "../utils/convert";
import {LinkIcon} from "@heroicons/react/24/solid";
import Spinner from "./Spinner";
import {getExplorerLink, getAxelarLink} from "../utils/getExplorerLink";
import {useChainId} from "wagmi";

export enum TRANSACTION_STATE {
    PENDING,
    FAILED,
    CONFIRMED
}

const TransactionModal = ({isOpen, onClose, state, hash, txChainId, type, transferAmount, transferSymbol}) => {

    const modalContentRef = useRef<HTMLDivElement | null>(null);

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

    const handleLinkRedirect = (hash_, txChainId_) => {
        window.open(getExplorerLink(hash_, txChainId_, 'transaction'), '_blank')
    }

    const handleAxelarLinkRedirect = (hash_) => {
        window.open(getAxelarLink(hash_), '_blank')
    }

    return (
        <div className="fixed top-16 left-0 w-full h-full flex justify-center mt-16 bg-opacity-50 bg-neutral-1000 z-50">
            {
                state === TRANSACTION_STATE.PENDING ?
                    <div ref={modalContentRef}
                         className="bg-neutral-800 rounded-3xl w-[580px] h-[296px] p-10 border border-neutral-600 space-y-8">
                        <div className="font-sans text-xl font-medium leading-8 tracking-normal text-center">
                            Your transaction is pending
                        </div>
                        <Spinner width={20} height={20} className={''}/>
                        <div className="text-neutral-600 font-bold text-xs leading-6 tracking-normal text-center">
                            Approve the transaction in your wallet extension or mobile app and wait for it to conclude.
                        </div>
                    </div> :
                    state === TRANSACTION_STATE.FAILED ?
                        <div ref={modalContentRef}
                             className="bg-neutral-800 rounded-3xl w-[580px] h-[388px] p-10 border border-neutral-600 space-y-8">
                            <div className="font-sans text-xl font-semibold leading-8 tracking-tight text-center">
                                Unfortunately your transaction failed
                            </div>
                            <img src={'/images/failed-trx.svg'} alt={"Failed Transaction"}
                                 className={'w-[89]] h-[88px] mx-auto'}/>
                            <div
                                className="text-neutral-600 font-semibold text-xs leading-6 tracking-normal text-center">
                                Please try again shortly. If you still experience issues please contact our community
                                support.
                            </div>
                            <Button
                                className={'w-[495px] h-[60px] rounded'}
                                variant={BUTTON_VARIANTS.EMPTY}
                                disabled={false}
                                onClick={() => onClose()}
                            >
                                Close
                            </Button>
                        </div> :
                        state === TRANSACTION_STATE.CONFIRMED ?
                            <div ref={modalContentRef}
                                 className="bg-neutral-800 rounded-3xl w-[580px] h-[428px] p-10 border border-neutral-600 space-y-8">
                                <div className="font-sans text-xl font-semibold leading-8 tracking-tight text-center">
                                    Your transaction was sent
                                </div>
                                <img src={'/images/confirmed-trx.svg'} alt={"Failed Transaction"}
                                     className={'w-[89]] h-[88px] mx-auto'}/>
                                <div className="grid grid-cols-2 w-[495px] h-[88px]">
                                    <div className="text-sm text-neutral-600 font-semibold">{capitalizeFirstLetter(type)}</div>
                                    <div className="text-end font-light">{transferAmount ?? ''} {transferSymbol}</div>
                                    <div className="text-sm text-neutral-600 font-semibold">Transaction hash</div>
                                    <div className=" flex font-light justify-end hover:cursor-pointer"
                                         onClick={() => handleLinkRedirect(hash, txChainId)}>
                                        {shortenTransactionID(hash)}
                                        {hash && <span className='ml-2' onClick={() => handleLinkRedirect(hash, txChainId)}>
                                            <LinkIcon className="h-6 w-4 hover:cursor-pointer"/>
                                        </span>}
                                        {hash && <span className='ml-2' onClick={() => handleAxelarLinkRedirect(hash)}>
                                            <LinkIcon className="h-6 w-4 hover:cursor-pointer"/>
                                        </span>}
                                    </div>
                                </div>

                                <Button
                                    className={'w-[495px] h-[60px] rounded'}
                                    variant={BUTTON_VARIANTS.EMPTY}
                                    disabled={false}
                                    onClick={() => onClose()}
                                >
                                    Close
                                </Button>
                            </div> : ''
            }
        </div>
    )
};

export default TransactionModal;