import {useEffect, useState} from "react";
import {leaderboardQuery} from "../services/apollo/queries";
import {useQuery} from "@apollo/client";
import {useChainId} from "wagmi";

type Token = {
    symbol: string,
    pointsSupplied: number,
    pointsBorrowed: number,
    pointsSeiyanLP: number
}

type Account = {
    id: string,
    tokens: Token[]
}

type Accounts = {
    accounts: Account[],
    pageInfo: any
}


interface SenderData {
    // depositAmount?: number;
    // depositHeight?: number;
    // borrowAmount?: number;
    // borrowHeight?: number;
    supplyPoints?: number;
    borrowPoints?: number;
    seiyanPoints?: number;
    totalPoints?: number;
}

interface LeaderboardData extends SenderData {
    account: string
}

export const useRawLeaderboardData = () => {
    const chainId = useChainId()
    const [allData, setAllData] = useState<Array<Account>>([]);
    const PAGE_SIZE = 100;
    let skip = 0

    useEffect(() => {
        setAllData([])
    }, [chainId])

    const processData = (data: Accounts) => {
        setAllData(prev => [...prev, ...data.accounts]);
        if (data.accounts.length === PAGE_SIZE) {
            skip = skip + PAGE_SIZE
            fetchMore({
                variables: {first: PAGE_SIZE, skip: skip},
            })
                .then(({data}) => {
                    processData(data)
                })
        }
    }

    const {loading, error, data, fetchMore} = useQuery(leaderboardQuery, {
        variables: {first: PAGE_SIZE, skip: 0},
        context: {chainId},
        fetchPolicy: 'network-only',
        onCompleted: processData
    });

    return {data: allData, loading, error};
};

export function useLeaderboard() {
    const {data, loading, error} = useRawLeaderboardData()

    const leaderboard: Array<LeaderboardData> = []
    for (const account of data) {
        let supplyPoints = 0
        let borrowPoints = 0
        let seiyanPoints = 0
        for (const token of account.tokens) {
            supplyPoints += Number(token.pointsSupplied)
            borrowPoints += Number(token.pointsBorrowed)
            seiyanPoints += Number(token.pointsSeiyanLP)
        }

        supplyPoints = supplyPoints < 0 ? 0 : supplyPoints
        borrowPoints = borrowPoints < 0 ? 0 : borrowPoints
        seiyanPoints = seiyanPoints < 0 ? 0 : seiyanPoints

        const totalPoints = supplyPoints + borrowPoints + seiyanPoints
        leaderboard.push({
            account: account?.id,
            supplyPoints,
            borrowPoints,
            seiyanPoints,
            totalPoints
        })
    }

    return {
        leaderboard: leaderboard.sort((a: LeaderboardData, b: LeaderboardData) => b.totalPoints! - a.totalPoints!),
        totalSum: leaderboard.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.totalPoints!;
        }, 0),
        loading,
        error
    }
}