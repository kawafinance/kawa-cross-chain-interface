import {useLeaderboard} from "../../hooks/useLeaderboard";
import React from "react";
import Leaderboard from "../../components/Leaderboard/Leaderboard";

const LeaderboardPage = () => {
    const {leaderboard, loading} = useLeaderboard()

    return <Leaderboard data={leaderboard} loading={loading}/>
}

export default LeaderboardPage