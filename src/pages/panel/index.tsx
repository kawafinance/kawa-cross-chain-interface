import React, {JSX, useEffect, useMemo, useState} from 'react';
import {useFarm, useUserInfo} from "../../hooks/useLendFarms";
import {useNavigate, useParams} from "react-router-dom";
import {capitalizeFirstLetter, formatAmountToRaw, formatRawAmount} from "../../utils/convert";
import Typography from "../../components/Typography";
import {CurrencyAmountInput} from "../../components/CurrencyAmountInput";
import {Button, BUTTON_VARIANTS} from "../../components/Button";
import RangeSlider from "../../components/RangeSlider";
import FutureBalance from "../../components/FutureBalance";
import TransactionModal, {TRANSACTION_STATE} from "../../components/TransactionModal";
import useMarketContract from "../../hooks/useMarketContract.ts";
import {useSEIBalance, useTokenBalance} from "../../hooks/useBalance";
import {MARKETS, NATIVE_CHAIN_ID} from "../../constants/contracts.ts";
import {MaxUint256} from '@ethersproject/constants'
import {BigNumber} from "bignumber.js";
import useIsMobile from "../../hooks/useIsMobile";
import {useAccount, useChainId, useSwitchChain, useBalance } from "wagmi";
import {useAddRecentTransaction} from "@rainbow-me/rainbowkit";


export const TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAW: 'withdraw',
    BORROW: 'borrow',
    REPAY: 'repay',
    ENABLE_COLLATERAL: 'enable',
    DISABLE_COLLATERAL: 'disable'
}

export default function Panel(): JSX.Element {
    const {type, asset} = useParams()

    const farm = useFarm(asset)
    const {
        mint,
        redeem,
        redeemUnderlying,
        borrow,
        repayBorrow,
        repayBorrowBehalf,
        hash,
        txChainId,
        error,
        isPending
    } = useMarketContract(
        asset!,
        farm?.client,
        farm?.chainId,
        type!
    )
    const chainId = useChainId()
    const {address} = useAccount()
    const { switchChain } = useSwitchChain()
    const addRecentTransaction = useAddRecentTransaction();

    const userInfo = useUserInfo()

    const nativeBalance = useBalance({
        address,
        chainId: farm?.chainId
    })
    // const tokenBalance = useTokenBalance(farm?.underlying)
    const redeemMaxAmount = useTokenBalance(farm?.id)
    const underlyingBalance = nativeBalance?.data?.value // farm?.underlyingSymbol === 'SEI' ? nativeBalance : tokenBalance
    const navigate = useNavigate()
    const isMobile = useIsMobile()

    const [sentSwitchChain, setSentSwitchChain] = useState(false)
    const [amount, setAmount] = useState('')
    const [percentage, setPercentage] = useState(0);
    const [disabled, setDisabled] = useState(true);
    const [buttonLabel, setButtonLabel] = useState(capitalizeFirstLetter(type));
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [transactionState, setTransactionState] = useState<TRANSACTION_STATE>(TRANSACTION_STATE.PENDING)
    const [tippyDisabled, setTippyDisabled] = useState<boolean>(true)
    const [sendMax, setSendMax] = useState(false)
    const [trasnferAmount, setTransferAmount] = useState('')
    const amountRaw = useMemo(() => formatAmountToRaw(amount, farm?.underlyingDecimals), [amount])

    // const {needsApprove, approve, hash: approveHash, error: approveError, isPending: approveIsPending } = useToken(farm?.underlying, farm?.id, amountRaw)

    const max = useMemo(() => {
        const isNative = true//farm?.id == MARKETS.find(r => r.symbol == 'kSEI')?.id
        const cashFarmMaxToBorrow = farm?.cash / 10 ** farm?.underlyingDecimals
        const borrowAvailable = farm?.borrowCap > 0
            ? farm?.borrowCap - farm?.liquidity - (10*(farm?.underlyingDecimals/2))/(10**farm?.underlyingDecimals)
            : farm?.liquidity - (10*(farm?.underlyingDecimals/2))/(10**farm?.underlyingDecimals)
        const borrowCash = borrowAvailable > cashFarmMaxToBorrow ? cashFarmMaxToBorrow : borrowAvailable
        const userAssetsMaxToWithdraw = userInfo?.accountLiquidity?.div(farm?.price).div(farm?.collateralFactorMantissa)
        const userAssetsMaxToBorrow = userInfo?.accountLiquidity?.div(farm?.price)
        const value = {
            [TYPES.DEPOSIT]: formatRawAmount(
                isNative ? Number(underlyingBalance) - (10**16): underlyingBalance,
                farm?.underlyingDecimals
            ),
            [TYPES.WITHDRAW]: userInfo?.borrowBalance > 0
                ? userAssetsMaxToWithdraw > farm?.balanceOfUnderlying
                    ? farm?.balanceOfUnderlying
                    : userAssetsMaxToWithdraw
                : farm?.balanceOfUnderlying,
            [TYPES.BORROW]: userAssetsMaxToBorrow?.gt(borrowCash)
                ? borrowCash
                : userAssetsMaxToBorrow,
            [TYPES.REPAY]: farm?.borrowBalanceCurrent
        }[type!]
        return value > 0 ? value.toFixed(farm?.decimals) : 0
    }, [farm, userInfo])

    const futureBorrowBalance = useMemo(() => {
        const value = {
            [TYPES.DEPOSIT]: 0,
            [TYPES.WITHDRAW]: 0,
            [TYPES.BORROW]: Number(amount) * farm?.underlyingPrice,
            [TYPES.REPAY]: -(Number(amount) * farm?.underlyingPrice)
        }[type!]

        return disabled ? userInfo?.borrowBalance : userInfo?.borrowBalance + value
    }, [farm, userInfo, amount, disabled])

    const futureMax = useMemo(() => {
        const value = {
            [TYPES.DEPOSIT]: Number(amount) * farm?.underlyingPrice * farm?.collateralFactorMantissa,
            [TYPES.WITHDRAW]: -(Number(amount) * farm?.underlyingPrice * farm?.collateralFactorMantissa),
            [TYPES.BORROW]: 0,
            [TYPES.REPAY]: 0
        }[type!]

        return disabled ? userInfo?.totalAvailable : userInfo?.totalAvailable.plus(value)
    }, [farm, userInfo, amount, disabled])

    useEffect(() => {
        if (
            farm?.chainId
            && (type === TYPES.DEPOSIT || type === TYPES.REPAY)
            && chainId !== farm?.chainId
            && !sentSwitchChain
        ) {
            try{
                console.log(farm?.chainId)
                switchChain({ chainId: farm?.chainId })
                setSentSwitchChain(true)
            }catch (e){
                console.error(e)
            }
        }else if(
            farm?.chainId
            && (type === TYPES.WITHDRAW || type === TYPES.BORROW)
            && chainId !== NATIVE_CHAIN_ID
            && !sentSwitchChain
        ) {
            try{
                switchChain({ chainId: NATIVE_CHAIN_ID })
                setSentSwitchChain(true)
            }catch (e){
                console.error(e)
            }
        }
    }, [farm, chainId, switchChain]);

    useEffect(() => {
        if (
            ((type === TYPES.DEPOSIT || type === TYPES.REPAY)
            && chainId !== farm?.chainId)
            ||
            ((type === TYPES.WITHDRAW || type === TYPES.BORROW)
                && chainId !== NATIVE_CHAIN_ID)
        ){
            setDisabled(true)
            setButtonLabel('You\'ve are on the wrong network')
        }else if (Number(max) === 0) {
            setDisabled(true)
            setButtonLabel('You\'ve reached the limit')
        } else if (Number(amount) === 0) {
            setDisabled(true)
            setButtonLabel('Enter an amount')
        } else if (Number(amount) > Number(max)) {
            setDisabled(true)
            setButtonLabel('Insufficient Balance')
        } else {
            setDisabled(false)
            // if ((type === TYPES.DEPOSIT || type === TYPES.REPAY) && needsApprove) {
            //     setButtonLabel('Approve')
            // } else {
                setButtonLabel(capitalizeFirstLetter(type))
            // }
        }
    }, [amount, max, chainId])

    useEffect(() => {
        if (type === TYPES.DEPOSIT && farm?.underlyingSymbol === 'SEI') {
            if (Number(amount) === Number(max) && Number(amount) > 0) {
                setTippyDisabled(false)
            } else {
                setTippyDisabled(true)
            }
        }
    }, [amount, max])

    const balanceLabel = {
        [TYPES.DEPOSIT]: 'Balance',
        [TYPES.WITHDRAW]: 'Available',
        [TYPES.BORROW]: 'Available',
        [TYPES.REPAY]: 'Borrowed'
    }[type!]

    const handleUserInput = (input) => {
        setAmount(input)
        setPercentage(Math.min(((input / Number(max)) * 100), 100))
        setSendMax(false)
    }

    const handlePercentageChange = (value) => {
        setPercentage(value);
        if (value === 100) {
            setSendMax(true)
        } else if (sendMax) {
            setSendMax(false)
        }
        const decimals = farm?.underlyingDecimals > 10 ? 10 : farm?.underlyingDecimals
        const newAmount = ((Number(max) * value) / 100).toFixed(decimals)
        if (Number(newAmount) === 0) {
            setAmount('')
        } else {
            setAmount(newAmount);
        }
    };

    const handleButtonClick = async () => {
        setTippyDisabled(true)
        // setHash('')
        setTransactionState(TRANSACTION_STATE.PENDING)
        setIsModalOpen(true)
        setTransferAmount(amount)
        let tx
        // if ((type === TYPES.DEPOSIT || type === TYPES.REPAY) && needsApprove) {
        //     tx = approve()
        // } else {
            let repayAmount
            switch (type) {
                case TYPES.DEPOSIT:
                    tx = mint(amountRaw)
                    break;
                case TYPES.WITHDRAW:
                    sendMax && userInfo?.borrowBalance === 0
                        ? tx = redeem(redeemMaxAmount)
                        : tx = redeemUnderlying(amountRaw)
                    break;
                case  TYPES.BORROW:
                    tx = borrow(amountRaw)
                    break;
                case  TYPES.REPAY:
                    repayAmount =
                        sendMax
                            ? farm?.id == MARKETS.find(r => r.symbol == 'kSEI' || r.symbol == 'kSEI')?.id
                                ? new BigNumber(amountRaw).plus(10 ** (farm?.underlyingDecimals - 3)).toFixed(0)
                                : MaxUint256.toString() // formatAmountToRaw(farm?.borrowBalanceCurrent, farm?.underlyingDecimals)
                            : amountRaw
                    tx = repayBorrowBehalf(address, repayAmount, sendMax)
                    break;

            }
            // dataActions?.refetch()
            setAmount('')
            setPercentage(0)
            setSendMax(false)
        // }
    }

    useEffect(() => {
        // if ((type === TYPES.DEPOSIT || type === TYPES.REPAY) && needsApprove) {
        //     if (!approveIsPending) {
        //         if (approveHash) {
        //             addRecentTransaction({
        //                 hash: approveHash,
        //                 description: `Approve ${farm?.underlyingSymbol}`
        //             })
        //             setTransactionState(TRANSACTION_STATE.CONFIRMED)
        //         } else {
        //             setTransactionState(TRANSACTION_STATE.FAILED)
        //         }
        //     }
        // }else {
            if (!isPending) {
                if (hash) {
                    addRecentTransaction({
                        hash,
                        description: `${capitalizeFirstLetter(type)} ${farm?.underlyingSymbol}`
                    })
                    setTransactionState(TRANSACTION_STATE.CONFIRMED)
                } else {
                    setTransactionState(TRANSACTION_STATE.FAILED)
                }
            // }
        }
    }, [hash, isPending]);

    useEffect(() => {
        if (error) console.log(error.message)
    }, [error]);

    const handleOnBack = () => {
        navigate('/lend')
    }

    const handleOnCloseModal = () => {
        setIsModalOpen(false)
    }
    return (
        <>
            <div className={'space-y-8'}>

                <div
                    className={`flex w-full space-y-2 items-end justify-items-start`}
                    onClick={handleOnBack}
                >
                    <div
                        className={'flex items-center justify-center bg-neutral-800 rounded-xl w-[32px] h-[32px] hover:cursor-pointer'}>
                        <img src={'/images/left-icon.svg'} alt={'left-icon'}/>
                    </div>
                    <div className={'items-center justify-center text-center'}>
                        <Typography
                            variant='h3'
                            className='pl-2 hover:cursor-pointer'
                        >
                            {capitalizeFirstLetter(type)}
                        </Typography>
                    </div>
                </div>

                <div className={'flex w-full space-x-4'}>
                    <div className={'md:w-4/5 space-y-4'}>

                        <div className={"bg-neutral-800 rounded-3xl p-[24px] space-y-8"}>
                            <div className={'items-center justify-center text-start'}>
                                <Typography variant='h3'>
                                    Select amount to {type}
                                </Typography>
                            </div>
                            <CurrencyAmountInput
                                amount={amount}
                                balance={max}
                                balanceLabel={balanceLabel}
                                onUserInput={handleUserInput}
                                symbol={farm?.underlyingSymbol}
                                className={'bg-neutral-500 rounded-3xl p-8 h-[100px]'}
                            />
                            <RangeSlider
                                percentage={percentage}
                                onPercentageChange={handlePercentageChange}
                                tippyDisabled={tippyDisabled}
                            />
                            <Button
                                className={'h-[60px] w-full rounded'}
                                variant={disabled ? BUTTON_VARIANTS.EMPTY : BUTTON_VARIANTS.FILLED}
                                disabled={disabled}
                                onClick={handleButtonClick}
                            >
                                {buttonLabel}
                            </Button>
                        </div>

                        <FutureBalance
                            className={'bg-neutral-800 rounded-3xl'}
                            borrowBalance={futureBorrowBalance}
                            max={futureMax}
                        />

                    </div>

                    {!isMobile && (<div className={'w-1/5 flex-col'}>
                        <div className={"bg-neutral-800 rounded-3xl p-[24px]"}>
                            <div className={'items-center justify-center text-start'}>
                                <Typography variant='h3'>
                                    How it works
                                </Typography>
                            </div>
                            <div className={'text-white text-opacity-50 text-left text-sm'}>
                                Select the amount you would like to {type} using the number input or slider. The
                                section
                                at the bottom will demonstrate your new borrow balance and composition
                            </div>
                        </div>
                    </div>)}

                </div>
            </div>
            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleOnCloseModal}
                state={transactionState}
                hash={hash}
                txChainId={txChainId}
                type={type}
                transferAmount={trasnferAmount}
                transferSymbol={farm?.underlyingSymbol}
            />
        </>
    )
}