import {useEffect, useMemo, useState} from "react";
import {marketDailySnapshots} from "../services/apollo/queries";
import {useQuery} from '@apollo/client';
import {useChainId} from "wagmi";
import {ChainId} from "../constants/chains.ts";

export type ChartData = {
    timestamp: number,
    totalSupplied: number,
    totalBorrowed: number
}

export const useRawChartData = () => {
    const chainId = useChainId()
    const [allData, setAllData] = useState<Array<object>>([]);
    const PAGE_SIZE = 100;
    let skip = 0

    const timestamp_gt = useMemo(() => chainId === ChainId.MAINNET ? 19917 : 0, [chainId])

    useEffect(() => {
        setAllData([])
    }, [chainId])

    const processData = (data) => {
        setAllData(prev => [...prev, ...data.marketDailySnapshots]);
        if (data.marketDailySnapshots.length === PAGE_SIZE) {
            skip = skip + PAGE_SIZE
            fetchMore({
                variables: {timestamp_gt, first: PAGE_SIZE, skip: skip},
            })
                .then(({data}) => {
                    processData(data)
                })
        }
    }

    const {loading, error, data, fetchMore} = useQuery(marketDailySnapshots, {
        variables: {timestamp_gt, first: PAGE_SIZE, skip: 0},
        context: {chainId},
        fetchPolicy: 'network-only',
        onCompleted: processData
    });

    return {data: allData, loading, error};
};

export const useChartData = (): ChartData[] => {
    const chainId = useChainId()
    const [parsedData, setParsedData] = useState<Array<ChartData>>([])

    useEffect(() => {
        setParsedData([])
    }, [chainId])

    const {data, loading, error} = useRawChartData()

    const parseData = (data: any): ChartData[] => {
        if (!data || data?.length === 0) {
            return data;
        }
        const result = data.reduce((acc, curr) => {
            const {timestamp, totalSuppliesUSD, totalBorrowsUSD} = curr;
            const timestampRaw = Number(timestamp)
            const totalSuppliesUSDRaw = Number(totalSuppliesUSD)
            const totalBorrowsUSDRaw = Number(totalBorrowsUSD)
            const existingIndex = acc.findIndex(item => item.timestamp === timestampRaw);
            if (existingIndex === -1) {
                acc.push({
                    timestamp: timestampRaw,
                    totalSupplied: totalSuppliesUSDRaw,
                    totalBorrowed: totalBorrowsUSDRaw
                });
            } else {
                acc[existingIndex].totalSupplied = acc[existingIndex].totalSupplied + (totalSuppliesUSDRaw);
                acc[existingIndex].totalBorrowed = acc[existingIndex].totalBorrowed + (totalBorrowsUSDRaw);
            }
            return acc;
        }, []);

        const filledData: ChartData[] = [];

        filledData.push({
            timestamp: result?.[0].timestamp,
            totalSupplied: result?.[0].totalSupplied,
            totalBorrowed: result?.[0].totalBorrowed
        });

        for (let i = 1; i < result?.length; i++) {
            const currentTimestamp = result?.[i].timestamp
            const previousTimestamp = filledData[filledData.length - 1].timestamp;

            const timeDiff = currentTimestamp - previousTimestamp;

            let newTimestamp = previousTimestamp
            for (let j = 1; j < timeDiff; j++) {
                newTimestamp += 1;
                filledData.push({
                    timestamp: newTimestamp,
                    totalSupplied: filledData[filledData.length - 1].totalSupplied,
                    totalBorrowed: filledData[filledData.length - 1].totalBorrowed
                });
            }
            if (result?.[i].totalSupplied === 0 && result?.[i].totalSupplied === 0) {
                filledData.push({
                    timestamp: result?.[i].timestamp,
                    totalSupplied: filledData[filledData.length - 1].totalSupplied,
                    totalBorrowed: filledData[filledData.length - 1].totalBorrowed
                });
            } else {
                filledData.push({
                    timestamp: result?.[i].timestamp,
                    totalSupplied: result?.[i].totalSupplied,
                    totalBorrowed: result?.[i].totalBorrowed > 0.0001 ? result?.[i].totalBorrowed : 0
                });
            }

        }

        return filledData
    }

    useEffect(() => {
        if (!loading && data) {
            const results = parseData(data)
            setParsedData(results)
        }
    }, [data])

    return parsedData
}