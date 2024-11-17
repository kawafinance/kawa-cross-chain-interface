import React from 'react';
import Chart from "../../components/Chart/Chart";
import {ChartInfo} from "../../components/Chart/ChartInfo";
import {ChartData, useChartData} from "../../hooks/useChartData";
import {formatNumber} from "../../utils/convert";

const Overview = () => {
    const data = useChartData()
    const lastTotalSupplied = data?.[data?.length - 1]?.totalSupplied
    const lastTotalBorrowed = (data as ChartData[])?.[data?.length - 1]?.totalBorrowed

    return (
        <div className="bg-neutral-800 p-6 min-h-[400px] rounded-3xl space-y-2 border">
            <div className={'flex justify-between'}>
                <h2 className="text-xl mb-4">Overview</h2>
                {/*<ChartTimeframeSelector*/}
                {/*    timeframeOptions={['1D', '1W', '1M', '1Y', 'All']}*/}
                {/*    value={timeframe}*/}
                {/*    onSelect={setTimeframe}*/}
                {/*/>*/}
            </div>
            <div className={'flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-16'}>
                <ChartInfo
                    label={'Total supplied'}
                    // value1={formatNumber(lastTotalSupplied)}
                    value1={formatNumber(lastTotalSupplied, true)}
                    value2={''}
                    className={'bg-beam-primary-500'}
                />
                <ChartInfo
                    label={'Total borrowed'}
                    // value1={formatNumber(lastTotalBorrowed)}
                    value1={formatNumber(lastTotalBorrowed, true)}
                    value2={''}
                    className={'bg-beam-secondary-500'}
                />
            </div>
            <div className="h-[400px]">
                <Chart
                    data={data}
                    timeframe={'All'}
                />
            </div>
        </div>
    );
}


export default Overview;
