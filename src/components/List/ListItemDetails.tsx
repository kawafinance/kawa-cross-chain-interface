import {Button, BUTTON_VARIANTS} from "../Button";
import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'
import {TYPES} from "../../pages/panel";
import {capitalizeFirstLetter} from "../../utils/convert";
import useUnitroller from "../../hooks/useUnitroller";
import {useUserInfo} from "../../hooks/useLendFarms";
import TransactionModal, {TRANSACTION_STATE} from "../TransactionModal";
import CollateralModal from "../CollateralModal";
import Tippy from "@tippyjs/react";
import {useChainId, useSwitchChain} from "wagmi";
import {useAddRecentTransaction} from "@rainbow-me/rainbowkit";
import {NATIVE_CHAIN_ID} from "../../constants/contracts.ts";

const ListItemDetails = ({type, farm}) => {
    const navigate = useNavigate()
    const { switchChain } = useSwitchChain()
    const chainId = useChainId()
    const addRecentTransaction = useAddRecentTransaction();
    const {
        enterMarkets,
        exitMarket,
        hash,
        error,
        isPending
    } = useUnitroller()
    const userInfo = useUserInfo()
    const [isCollateralModalOpen, setIsCollateralIsModalOpen] = useState(false)
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
    // const [hash, setHash] = useState<string>('')
    const [transactionState, setTransactionState] = useState<TRANSACTION_STATE>(TRANSACTION_STATE.PENDING)
    const action = farm?.inMarket ? TYPES.DISABLE_COLLATERAL : TYPES.ENABLE_COLLATERAL
    const [transactionAction, setTransactionAction] = useState('')
    const futureMax =
        farm?.inMarket
            ? userInfo?.totalAvailable - (farm?.balanceOfUnderlyingTVL * farm?.collateralFactorMantissa)
            : userInfo?.totalAvailable + (farm?.balanceOfUnderlyingTVL * farm?.collateralFactorMantissa)

    const collateralActionAvailable =
        userInfo?.borrowBalance === 0 ||
        futureMax > 0 && futureMax > userInfo?.borrowBalance

    const borrowButtonDisable =
        farm?.borrowPaused ||
        (farm?.borrowCap > 0 && farm?.borrowCap < farm?.borrow) ||
        userInfo?.accountLiquidity.eq(0)

    const handleClick = (action) => {
        if (action === 'collateral') {
            switchChain({ chainId: NATIVE_CHAIN_ID })
            setIsCollateralIsModalOpen(true)
        } else {
            navigate(`/lend/${action}/${farm?.id}`)
        }
    }

    const handleOnCloseTransactionModal = () => {
        setIsTransactionModalOpen(false)
    }

    const handleOnConfirm = async () => {
        setTransactionState(TRANSACTION_STATE.PENDING)
        setTransactionAction(action)
        setIsCollateralIsModalOpen(false)
        setIsTransactionModalOpen(true)
        let tx
        if (farm?.inMarket) {
            tx = exitMarket(farm?.id)
        } else {
            tx = enterMarkets(farm?.id)
        }
        // await tx
        //     .then(receipt => {
        //         setHash(receipt.hash)
        //         addTransaction(receipt, {
        //             summary: `${capitalizeFirstLetter(type)} ${farm?.underlyingSymbol}`
        //         })
        //         setTransactionState(TRANSACTION_STATE.CONFIRMED)
        //     })
        //     .catch(error => {
        //         setTransactionState(TRANSACTION_STATE.FAILED)
        //     })
    };

    useEffect(() => {
        if (!isPending) {
            if (hash) {
                addRecentTransaction({
                    hash,
                    description: `${capitalizeFirstLetter(transactionAction)} ${farm?.underlyingSymbol}`
                })
                setTransactionState(TRANSACTION_STATE.CONFIRMED)
            } else {
                setTransactionState(TRANSACTION_STATE.FAILED)
            }
        }

    }, [hash, isPending]);

    useEffect(() => {
        if (error) console.log(error)
    }, [error]);

    const MaybeTippy = ({enable, children}) => {
        return (
            <>
                {enable ?
                    <Tippy content={
                        <div
                            className={'rounded p-4 bg-gradient-to-r from-beam-primary-300-g to-sky-blue-g text-black'}>
                            {farm?.borrowPaused
                                ? 'The Borrow feature is currently unavailable and will be enabled at a later time.'
                                : (farm?.borrowCap > 0 && farm?.borrowCap < farm?.borrow)
                                    ? 'The borrowing limit for the market has been reached.'
                                    : 'In order to borrow, you need to deposit some assets and enable them as collateral.'
                            }
                        </div>
                    }>
                        <div>
                            {children}
                        </div>
                    </Tippy>
                    : <div>
                        {children}
                    </div>
                }
            </>
        )
    }

    return (
        <>
            <div className='flex justify-center space-x-4 text-[14px]'>
                {type === TYPES.DEPOSIT ?
                    (<>
                            {/*<Button*/}
                            {/*    className={'h-[40px] w-[112px] rounded'}*/}
                            {/*    variant={BUTTON_VARIANTS.FILLED}*/}
                            {/*    disabled={false}*/}
                            {/*    onClick={() => window.open(*/}
                            {/*        chainId === ChainId.MAINNET*/}
                            {/*            ? 'https://dragonswap.app/swap'*/}
                            {/*            : farm?.symbol === 'kSEI'*/}
                            {/*                ? chainId === ChainId.TESTNET*/}
                            {/*                    ? 'https://atlantic-2.app.sei.io/faucet'*/}
                            {/*                    : 'https://sei-evm.faucetme.pro/'*/}
                            {/*                : chainId === ChainId.TESTNET*/}
                            {/*                    ? ''*/}
                            {/*                    : 'https://test.dragonswap.app/swap'*/}
                            {/*        , '_blank')}*/}
                            {/*>*/}
                            {/*    Buy*/}
                            {/*</Button>*/}

                            <Button
                                className={'h-[40px] w-[112px] rounded'}
                                variant={BUTTON_VARIANTS.EMPTY}
                                disabled={farm?.userBalance?.lte(0)}
                                onClick={() => handleClick(TYPES.DEPOSIT)}
                            >
                                {capitalizeFirstLetter(TYPES.DEPOSIT)}
                            </Button>

                            {farm?.balanceOfUnderlying > 0 && (
                                <>
                                    <Button
                                        className={'h-[40px] w-[112px] rounded'}
                                        variant={BUTTON_VARIANTS.EMPTY}
                                        disabled={farm?.balanceOfUnderlying === 0}
                                        onClick={() => handleClick(TYPES.WITHDRAW)}
                                    >
                                        {capitalizeFirstLetter(TYPES.WITHDRAW)}
                                    </Button>
                                    <Button
                                        className={'h-[40px] w-[130px] rounded'}
                                        variant={BUTTON_VARIANTS.EMPTY}
                                        disabled={!collateralActionAvailable}
                                        onClick={() => handleClick('collateral')}
                                    >
                                        {farm?.inMarket ? 'Disable' : 'Enable'} Collateral
                                    </Button>
                                </>

                            )}
                        </>
                    ) : (
                        <>
                            <MaybeTippy enable={borrowButtonDisable}>
                                <Button
                                    className={'h-[40px] w-[112px] rounded'}
                                    variant={BUTTON_VARIANTS.EMPTY}
                                    disabled={borrowButtonDisable}
                                    onClick={() => handleClick(TYPES.BORROW)}
                                >
                                    {capitalizeFirstLetter(TYPES.BORROW)}
                                </Button>
                            </MaybeTippy>
                            {farm?.borrowBalanceCurrent > 0 && (
                                <Button
                                    className={'h-[40px] w-[112px] rounded'}
                                    variant={BUTTON_VARIANTS.EMPTY}
                                    disabled={farm?.borrowBalanceCurrent === 0}
                                    onClick={() => handleClick(TYPES.REPAY)}
                                >
                                    {capitalizeFirstLetter(TYPES.REPAY)}
                                </Button>
                            )}
                        </>
                    )}
            </div>

            <CollateralModal
                isOpen={isCollateralModalOpen}
                onClose={() => setIsCollateralIsModalOpen(false)}
                onConfirm={handleOnConfirm}
                type={action}
                futureBorrowBalance={userInfo?.borrowBalance}
                futureMax={futureMax}
                // state={transactionState}
                // result={result}
            />
            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={handleOnCloseTransactionModal}
                state={transactionState}
                hash={hash}
                type={transactionAction}
                transferSymbol={farm?.underlyingSymbol}
                transferAmount={''}
                txChainId={chainId}
            />
        </>
    )
}

export default ListItemDetails