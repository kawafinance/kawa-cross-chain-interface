import {useMemo} from "react";
import {MARKETS, NATIVE_CHAIN_ID} from "../constants/contracts.ts";
import {
    usePythOracleContractConfig,
    useUnitrollerContractConfig
} from "./useContract";
import kErc20DelegatorABI from '../constants/abis/kerc20delegator.json'
import {BigNumber} from "bignumber.js";
import {useAccount, useReadContract, useReadContracts} from "wagmi";
import {useLeaderboard} from "./useLeaderboard.ts";
import {MULTIPLIERS} from "../constants/rewards.ts";

const getKErc20DelegatorViewCall = (contractAddress, functionName, args = []) => {
    return {
        abi: kErc20DelegatorABI,
        address: contractAddress,
        functionName,
        args,
        chainId: NATIVE_CHAIN_ID
    }
}

export function useLendFarms() {

    const unitrollerContractConfig = useUnitrollerContractConfig()
    const pythOracleConfig = usePythOracleContractConfig()

    const getUnitrollerCall = (functionName, args) => {
        return {
            ...unitrollerContractConfig,
            functionName,
            args,
            chainId: NATIVE_CHAIN_ID
        }
    }
    const getPythOracleCall = (args) => {
        return {
            ...pythOracleConfig,
            functionName: 'getUnderlyingPrice',
            args,
            chainId: NATIVE_CHAIN_ID
        }
    }

    const getAssetCalls = (assetAddress) => {
        return [
            getKErc20DelegatorViewCall(assetAddress, 'totalBorrows'),                // 0
            getKErc20DelegatorViewCall(assetAddress, 'totalSupply'),                 // 1
            getKErc20DelegatorViewCall(assetAddress, 'totalReserves'),               // 2
            getKErc20DelegatorViewCall(assetAddress, 'getCash'),                     // 3
            getKErc20DelegatorViewCall(assetAddress, 'supplyRatePerTimestamp'),      // 4
            getKErc20DelegatorViewCall(assetAddress, 'borrowRatePerTimestamp'),      // 5
            getKErc20DelegatorViewCall(assetAddress, 'underlying'),                  // 6
            getPythOracleCall([assetAddress]),                              // 7
            getUnitrollerCall('markets', [assetAddress]),                   // 8
            getUnitrollerCall('borrowGuardianPaused', [assetAddress]),      // 9
            getUnitrollerCall('borrowCaps', [assetAddress])                 // 10
        ]
    }

    const {data: assetInfo} = useReadContracts({
        contracts: MARKETS.map(r => getAssetCalls(r.id)).flat()
    })

    return useMemo(() => {
        if (!assetInfo) {
            return []
        }
        const infoLength = assetInfo.length / MARKETS.length
        return MARKETS.map((r, i) => {
            const underlyingDecimals = 18//(r.symbol == 'kSEI' || r.symbol == 'kSEI') ? 18 : decimals[i]?.result?.[0]
            const underlyingSymbol = r.symbol.slice(1)
            return {
                ...r,
                totalBorrows: new BigNumber(assetInfo[i * infoLength]?.result),
                totalSupply: new BigNumber(assetInfo[i * infoLength + 1]?.result),
                totalReserves: new BigNumber(assetInfo[i * infoLength + 2]?.result),
                cash: new BigNumber(assetInfo[i * infoLength + 3]?.result),
                supplyRatePerTimestamp: new BigNumber(assetInfo[i * infoLength + 4]?.result),
                borrowRatePerTimestamp: new BigNumber(assetInfo[i * infoLength + 5]?.result),
                // underlyingPrice: new BigNumber(underlyingPrice[i*infoLegth]?.result) / 10 ** (2 * 18 - underlyingDecimals),
                underlying: assetInfo[i * infoLength + 6]?.result,
                underlyingPrice: new BigNumber(assetInfo[i * infoLength + 7]?.result).div(new BigNumber(10).pow(new BigNumber(2 * 18 - underlyingDecimals))),
                underlyingDecimals,
                underlyingSymbol,
                collateralFactorMantissa: new BigNumber(assetInfo[i * infoLength + 8]?.result[1]),
                borrowPaused: assetInfo[i * infoLength + 9]?.result,
                borrowCap: new BigNumber(assetInfo[i * infoLength + 10]?.result)
            }
        })
    }, [assetInfo])
}

export function useLendPositions() {
    const {address} = useAccount()

    const getPositionCalls = (assetAddress) => {
        return [
            getKErc20DelegatorViewCall(assetAddress, 'balanceOfUnderlying', [address]),  // 0
            getKErc20DelegatorViewCall(assetAddress, 'borrowBalanceCurrent', [address])  // 1
        ]
    }

    const {data: positions} = useReadContracts({
        contracts: MARKETS.map(r => getPositionCalls(r.id)).flat()
    })

    return useMemo(() => {
        if (!positions) {
            return []
        }
        const infoLength = positions.length / MARKETS.length
        return MARKETS?.map((r, i) => {
            return {
                id: r.id,
                balanceOfUnderlying: new BigNumber(positions[i * infoLength]?.result),
                borrowBalanceCurrent: new BigNumber(positions[i * infoLength + 1]?.result)
            }
        })
    }, [positions])
}

/**
 * @notice Determine the current account liquidity wrt collateral requirements
 * @return (possible error code (semi-opaque),
 *          account liquidity in excess of collateral requirements,
 *          account shortfall below collateral requirements)
 */
export function useAccountLiquidity() {
    const {address} = useAccount()
    const unitrollerContractConfig = useUnitrollerContractConfig()

    const {data: accountLiquidity} = useReadContract({
        ...unitrollerContractConfig,
        functionName: 'getAccountLiquidity',
        args: [String(address)],
        chainId: NATIVE_CHAIN_ID
    })

    const {data: marketsIn} = useReadContract({
        ...unitrollerContractConfig,
        functionName: 'getAssetsIn',
        args: [String(address)],
        chainId: NATIVE_CHAIN_ID
    })

    return useMemo(() => {
        if (!accountLiquidity || !marketsIn) {
            return {
                accountLiquidity: 0,
                marketsIn: []
            }
        }
        return {
            accountLiquidity: new BigNumber(accountLiquidity?.[1]) / 10 ** 18,
            marketsIn
        }
    }, [accountLiquidity, marketsIn])
}

export function usePendingRewards() {
    // const {account, chainId} = useActiveWeb3React()
    // const doubleScale = 1e36
    // const supplyScale = 1e54
    // const borrowScale = 1e36
    // const rewardTypes = ['0', '1']
    // const assets = CONTRACTS[chainId!]
    // const assetsAddresses = assets.map((r) => r.id)
    // const ASSET_INTERFACE = new Interface(kErc20DelegatorABI)
    // const rewardTypeMTokenArgs = []
    // const rewardTypeMTokenAddressArgs = []
    // rewardTypes.forEach(rewardType => {
    //     assetsAddresses.forEach(asset => {
    //         rewardTypeMTokenArgs.push([rewardType, asset])
    //         rewardTypeMTokenAddressArgs.push([rewardType, asset, account])
    //     })
    // })
    // const rewardTypeAddressArgs = rewardTypes.map(rewardType => {
    //     return [rewardType, account]
    // })
    //
    // const blockTimestamp = useCurrentBlockTimestamp()
    // const unitrollerContract = useUnitrollerContract()
    // const marketBorrowIndex = useMultipleContractSingleData(assetsAddresses, ASSET_INTERFACE, 'borrowIndex')
    // const borrowStateResults = useSingleContractMultipleData(unitrollerContract, 'rewardBorrowState', rewardTypeMTokenArgs) //await unitroller.rewardBorrowState(rewardType, mToken.address)
    // const borrowSpeed = useSingleContractMultipleData(unitrollerContract, 'borrowRewardSpeeds', rewardTypeMTokenArgs) //await unitroller.borrowRewardSpeeds(rewardType, mToken.address)
    // const totalBorrows = useMultipleContractSingleData(assetsAddresses, ASSET_INTERFACE, 'totalBorrows')
    // const totalSupply = useMultipleContractSingleData(assetsAddresses, ASSET_INTERFACE, 'totalSupply')
    // const borrowerIndex = useSingleContractMultipleData(unitrollerContract, 'rewardBorrowerIndex', rewardTypeMTokenAddressArgs) //await unitroller.rewardBorrowerIndex(rewardType, mToken.address, wallet)
    // const borrowBalanceStored = useMultipleContractSingleData(assetsAddresses, ASSET_INTERFACE, 'borrowBalanceStored', [account])
    // const rewardAccrued = useSingleContractMultipleData(unitrollerContract, 'rewardAccrued', rewardTypeAddressArgs) //await unitroller.rewardAccrued(rewardType, wallet)
    // const supplierTokens = useMultipleContractSingleData(assetsAddresses, ASSET_INTERFACE, 'balanceOf', [account])
    // const supplyStateResults = useSingleContractMultipleData(unitrollerContract, 'rewardSupplyState', rewardTypeMTokenArgs) //await unitroller.rewardSupplyState(rewardType, mToken.address)
    // const supplySpeed = useSingleContractMultipleData(unitrollerContract, 'supplyRewardSpeeds', rewardTypeMTokenArgs) //await unitroller.supplyRewardSpeeds(rewardType, mToken.address)
    // const supplierIndexResults = useSingleContractMultipleData(unitrollerContract, 'rewardSupplierIndex', rewardTypeMTokenAddressArgs) //await unitroller.rewardSupplierIndex(rewardType, mToken.address, wallet)
    // const initialIndexConstant = useSingleCallResult(unitrollerContract, 'initialIndexConstant') //await unitroller.initialIndexConstant();
    //
    // return useMemo(() => {
    //     if (
    //         !blockTimestamp ||
    //         !marketBorrowIndex ||
    //         !borrowStateResults ||
    //         !borrowSpeed ||
    //         !totalBorrows ||
    //         !totalSupply ||
    //         !borrowerIndex ||
    //         !borrowBalanceStored ||
    //         !rewardAccrued ||
    //         !supplierTokens ||
    //         !supplyStateResults ||
    //         !supplySpeed ||
    //         !supplierIndexResults ||
    //         !initialIndexConstant
    //     ) {
    //         return null
    //     }
    //     return rewardTypes.map((rewardLabel, rewardType) => {
    //         // todo
    //         const symbol = rewardType == 0 ? 'KAWA' : 'SEI'
    //         const address = rewardType == 0 ? '0xBb8d88bcD9749636BC4D2bE22aaC4Bb3B01A58F1' : '0x98878B06940aE243284CA214f92Bb71a2b032B8A'
    //
    //         let amount = 0
    //         assetsAddresses.forEach((asset, aid) => {
    //
    //             const resultIndex = rewardType * assetsAddresses.length + aid
    //
    //             // updateRewardBorrowIndex
    //             // let borrowState =
    //             //   {
    //             //     index: Number(borrowStateResults[resultIndex]?.result?.index),
    //             //     timestamp: Number(borrowStateResults[resultIndex]?.result?.timestamp)
    //             //   }
    //             // const deltaTimestampsB = Number(blockTimestamp) - borrowState.timestamp
    //             // if (deltaTimestampsB > 0 && Number(borrowSpeed[resultIndex]?.result) > 0) {
    //             //   const borrowAmount = Number(totalBorrows[aid]?.result) / Number(marketBorrowIndex[aid]?.result)
    //             //   const wellAccrued = deltaTimestampsB * Number(borrowSpeed[resultIndex]?.result)
    //             //   const ratio = borrowAmount > 0 ? wellAccrued * doubleScale / borrowAmount : 0
    //             //   borrowState.index = borrowState.index + ratio
    //             // }
    //
    //             // distributeBorrowerReward
    //             const borrowIndex = Number(borrowStateResults[resultIndex]?.result?.index)
    //             if (Number(borrowerIndex[resultIndex]?.result) > 0) {
    //                 const deltaIndexB = borrowIndex - Number(borrowerIndex[resultIndex]?.result)
    //                 const borrowerAmount = Number(borrowBalanceStored[aid]?.result) / Number(marketBorrowIndex[aid]?.result)
    //                 const borrowerDelta = borrowerAmount * deltaIndexB
    //                 const borrowerAccrued = Number(rewardAccrued[rewardType]?.result) + borrowerDelta
    //                 amount = borrowerAccrued / borrowScale + amount
    //             }
    //
    //             // updateRewardSupplyIndex
    //             const supplyState =
    //                 {
    //                     index: Number(supplyStateResults[resultIndex]?.result?.index),
    //                     timestamp: Number(supplyStateResults[resultIndex]?.result?.timestamp)
    //                 }
    //             const deltaTimestampsS = Number(blockTimestamp) - supplyState.timestamp
    //             if (deltaTimestampsS > 0 && Number(supplySpeed[resultIndex]?.result) > 0) {
    //                 const supplyTokens = Number(totalSupply[aid]?.result)
    //                 const wellAccrued = deltaTimestampsS * Number(supplySpeed[resultIndex]?.result)
    //                 const ratio = supplyTokens > 0 ? wellAccrued * doubleScale / supplyTokens : 0
    //                 supplyState.index = supplyState.index + ratio
    //             }
    //
    //             // distributeSupplierReward
    //             const supplyIndex = supplyState.index
    //
    //             let supplierIndex = Number(supplierIndexResults[resultIndex]?.result)
    //             if (supplierIndex === 0 && supplyIndex > 0) {
    //                 supplierIndex = Number(initialIndexConstant?.result)
    //             }
    //             const deltaIndexS = supplyIndex - supplierIndex
    //             const supplierDelta = Number(supplierTokens[aid]?.result) * deltaIndexS
    //             const supplierAccrued = Number(rewardAccrued[rewardType]?.result) + supplierDelta
    //             amount = supplierAccrued / supplyScale + amount
    //         })
    //
    //         return {
    //             id: rewardType,
    //             symbol,
    //             amount,
    //             decimals: 18,
    //             address
    //         }
    //
    //     })
    //
    // }, [
    //     blockTimestamp,
    //     marketBorrowIndex,
    //     borrowStateResults,
    //     borrowSpeed,
    //     totalBorrows,
    //     totalSupply,
    //     borrowerIndex,
    //     borrowBalanceStored,
    //     rewardAccrued,
    //     supplierTokens,
    //     supplyStateResults,
    //     supplySpeed,
    //     supplierIndexResults,
    //     initialIndexConstant
    // ])
}

export function useLendFarm(id) {
    const farms = useLendFarms()
    return farms?.find(r => r.id == id)
}

export function useFarms() {
    const farms = useLendFarms()
    const positions = useLendPositions()
    const {marketsIn} = useAccountLiquidity()
    const {totalSum} = useLeaderboard()
    const monthlyRewards = 100 * 1000
    const aprPerPoint = (monthlyRewards / totalSum) * 12 * 100
    const aprPerPointCheck = aprPerPoint === Infinity ? 0 : aprPerPoint
    const map = (pool) => {
        const TIMESTAMPS_PER_DAY = 60 * 60 * 24
        const DAYS_PER_YEAR = 365
        const price = pool?.underlyingPrice
        const liquidity = pool?.cash / 10 ** pool?.underlyingDecimals
        const liquidityTVL = liquidity * price
        const borrow = pool?.totalBorrows / 10 ** pool?.underlyingDecimals
        const borrowTVL = borrow * price
        const borrowCap = pool?.borrowCap / 10 ** pool?.underlyingDecimals
        const supply = liquidity + borrow
        const supplyTVL = supply * price
        const reserves = pool?.totalReserves / 10 ** pool?.underlyingDecimals
        const reservesTVL = reserves * price
        const position = positions.find((position) => position.id === pool.id)
        const balanceOfUnderlying = position?.balanceOfUnderlying / 10 ** pool?.underlyingDecimals
        const balanceOfUnderlyingTVL = balanceOfUnderlying * price
        const borrowBalanceCurrent = position?.borrowBalanceCurrent / 10 ** pool?.underlyingDecimals
        const borrowBalanceCurrentTVL = borrowBalanceCurrent * price
        const supplyRate = new BigNumber(pool?.supplyRatePerTimestamp?.toString())
        const supplyBase = supplyRate?.shiftedBy(-18).times(TIMESTAMPS_PER_DAY).plus(1)
        const supplyAPY = supplyBase?.pow(DAYS_PER_YEAR).minus(1).times(100)
        const supplyRewardsAPR = aprPerPointCheck * MULTIPLIERS[pool?.underlyingSymbol].supply
        const borrowRate = new BigNumber(pool?.borrowRatePerTimestamp?.toString())
        const borrowBase = borrowRate.shiftedBy(-18).times(TIMESTAMPS_PER_DAY).plus(1)
        const borrowAPY = borrowBase.pow(DAYS_PER_YEAR).minus(1).times(100)
        const borrowRewardsAPR = aprPerPointCheck * MULTIPLIERS[pool?.underlyingSymbol].borrow
        const utilization = borrow / (liquidity + borrow - reserves) * 100
        const collateralFactorMantissa = pool?.collateralFactorMantissa / 10 ** 18
        const inMarket = marketsIn?.includes(pool.id)

        return {
            ...pool,
            liquidity,
            supply,
            borrow,
            reserves,
            liquidityTVL,
            borrowTVL,
            borrowCap,
            supplyTVL,
            reservesTVL,
            price,
            balanceOfUnderlying,
            balanceOfUnderlyingTVL,
            borrowBalanceCurrent,
            borrowBalanceCurrentTVL,
            supplyAPY,
            supplyRewardsAPR,
            borrowAPY,
            borrowRewardsAPR,
            utilization,
            collateralFactorMantissa,
            inMarket
        }
    }

    return useMemo(() => farms.map(map), [farms, positions, marketsIn])
}

export function useFarm(id) {
    const farms = useFarms()
    return useMemo(() => farms.find(f => f.id === id), [farms])
}

export function useUserInfo() {

    const farms = useFarms()
    const {accountLiquidity} = useAccountLiquidity()

    const borrowBalance = farms?.reduce((previousValue, currentValue) => {
        return previousValue + (isNaN(currentValue?.borrowBalanceCurrentTVL) ? 0 : currentValue?.borrowBalanceCurrentTVL)
    }, 0)

    const supplyBalance = farms?.reduce((previousValue, currentValue) => {
        return previousValue + (isNaN(currentValue?.balanceOfUnderlyingTVL) ? 0 : currentValue?.balanceOfUnderlyingTVL)
    }, 0)

    const totalAvailable = accountLiquidity + borrowBalance
    const borrowPerc = borrowBalance / totalAvailable * 100

    return {
        borrowBalance,
        supplyBalance,
        accountLiquidity,
        totalAvailable,
        borrowPerc
    }
}