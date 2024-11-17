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

const getKErc20DelegatorViewCall = (contractAddress: string, functionName: string, args: unknown[] = []) => {
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

    const getUnitrollerCall = (functionName: string, args: unknown[] = []) => {
        return {
            ...unitrollerContractConfig,
            functionName,
            args,
            chainId: NATIVE_CHAIN_ID
        }
    }
    const getPythOracleCall = (args: unknown[] = []) => {
        return {
            ...pythOracleConfig,
            functionName: 'getUnderlyingPrice',
            args,
            chainId: NATIVE_CHAIN_ID
        }
    }

    const getAssetCalls = (assetAddress: string) => {
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
        // @ts-ignore
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
                totalBorrows: new BigNumber((assetInfo[i * infoLength]?.result as bigint).toString()),
                totalSupply: new BigNumber((assetInfo[i * infoLength + 1]?.result as bigint).toString()),
                totalReserves: new BigNumber((assetInfo[i * infoLength + 2]?.result as bigint).toString()),
                cash: new BigNumber((assetInfo[i * infoLength + 3]?.result as bigint).toString()),
                supplyRatePerTimestamp: new BigNumber((assetInfo[i * infoLength + 4]?.result as bigint).toString()),
                borrowRatePerTimestamp: new BigNumber((assetInfo[i * infoLength + 5]?.result as bigint).toString()),
                // underlyingPrice: new BigNumber(underlyingPrice[i*infoLegth]?.result) / 10 ** (2 * 18 - underlyingDecimals),
                underlying: assetInfo[i * infoLength + 6]?.result,
                underlyingPrice: new BigNumber((assetInfo[i * infoLength + 7]?.result as bigint).toString())
                    .div(
                        new BigNumber(10)
                            .pow(new BigNumber(2 * 18 - underlyingDecimals))
                    ),
                underlyingDecimals,
                underlyingSymbol,
                collateralFactorMantissa: new BigNumber((assetInfo[i * infoLength + 8]?.result?.[1] as bigint).toString()),
                borrowPaused: assetInfo[i * infoLength + 9]?.result,
                borrowCap: new BigNumber((assetInfo[i * infoLength + 10]?.result as bigint).toString())
            }
        })
    }, [assetInfo])
}

export function useLendPositions(): { id: string, balanceOfUnderlying: BigNumber, borrowBalanceCurrent: BigNumber }[] {
    const {address} = useAccount()

    const getPositionCalls = (assetAddress) => {
        return [
            getKErc20DelegatorViewCall(assetAddress, 'balanceOfUnderlying', [address]),  // 0
            getKErc20DelegatorViewCall(assetAddress, 'borrowBalanceCurrent', [address])  // 1
        ]
    }

    const {data: positions} = useReadContracts({
        // @ts-ignore
        contracts: MARKETS.map(r => getPositionCalls(r.id)).flat()
    })

    return useMemo(() => {
        if (!positions) {
            return [{
                id: '',
                balanceOfUnderlying: new BigNumber(0),
                borrowBalanceCurrent: new BigNumber(0)
            }]
        }
        const infoLength = positions.length / MARKETS.length
        return MARKETS?.map((r, i) => {
            return {
                id: r.id,
                balanceOfUnderlying: new BigNumber((positions[i * infoLength]?.result as bigint)?.toString()),
                borrowBalanceCurrent: new BigNumber((positions[i * infoLength + 1]?.result as bigint)?.toString())
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
export function useAccountLiquidity(): { accountLiquidity: BigNumber, marketsIn: string[] } {
    const {address} = useAccount()
    const unitrollerContractConfig = useUnitrollerContractConfig()

    // @ts-ignore
    const {data: accountLiquidity} = useReadContract({
        ...unitrollerContractConfig,
        functionName: 'getAccountLiquidity',
        args: [String(address)],
        chainId: NATIVE_CHAIN_ID
    })

    // @ts-ignore
    const {data: marketsIn} = useReadContract({
        ...unitrollerContractConfig,
        functionName: 'getAssetsIn',
        args: [String(address)],
        chainId: NATIVE_CHAIN_ID
    })

    return useMemo(() => {
        if (!accountLiquidity || !marketsIn) {
            return {
                accountLiquidity: new BigNumber(0),
                marketsIn: []
            }
        }
        return {
            accountLiquidity: new BigNumber((accountLiquidity?.[1] as bigint).toString())
                .div(
                    new BigNumber(10)
                        .pow(new BigNumber(18))
                ),
            marketsIn: marketsIn as string[]
        }
    }, [accountLiquidity, marketsIn])
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
        const balanceOfUnderlying = position?.balanceOfUnderlying.div(
            new BigNumber(10)
                .pow(pool?.underlyingDecimals ?? new BigNumber(18))
        )
        const balanceOfUnderlyingTVL = balanceOfUnderlying?.multipliedBy(price)
        const borrowBalanceCurrent = position?.borrowBalanceCurrent.div(
            new BigNumber(10)
                .pow(pool?.underlyingDecimals ?? new BigNumber(18))
        )
        const borrowBalanceCurrentTVL = borrowBalanceCurrent?.multipliedBy(price)
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