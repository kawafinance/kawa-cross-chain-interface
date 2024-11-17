import React from 'react';
import {AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area} from 'recharts';
import {formatNumber} from "../../utils/convert";
import Spinner from "../Spinner";

const tickStyle = {
    'fontFamily': 'DM Sans',
    'fontSize': '12px',
    'fontWeight': 400,
    'lineHeight': '16px',
    'letterSpacing': '0px',
}

const formatDate = (value, timeframe) => {
    switch (timeframe) {
        case '1D':
            return new Date(value).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        case '1W':
            return new Date(value).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(',', '');
        case '1M':
        case '1Y':
        case 'All':
            return new Date(value * 24 * 60 * 60 * 1000).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: '2-digit'
            });
        default:
            return '';
    }
}

const CustomTickX = (props) => {
    const {x, y, payload, timeframe} = props
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={0} textAnchor="middle" fill="#666" style={tickStyle}>
                {formatDate(payload.value, timeframe)}
            </text>
        </g>
    );
};

const CustomTickY = (props) => {
    const {x, y, payload} = props
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={0} textAnchor="middle" fill="#666" style={tickStyle}>
                {formatNumber(payload.value, true)}
            </text>
        </g>
    );
};

const CustomTooltip = (props) => {
    const {active, payload, label, timeframe} = props

    if (active) {
        return (
            <div className="custom-tooltip bg-neutral-500 rounded p-5">
                <div key='date' className={'text-center'}>
                    {formatDate(label, timeframe)}
                </div>
                <div key='totalSupplied' className={'text-beam-primary-500'}>
                    <span>Total supplied:</span> {formatNumber(payload?.[0]?.value, true)}
                </div>
                <div key='totalBorrowed' className={'text-beam-secondary-500'}>
                    <span>Total borrowed:</span> {formatNumber(payload?.[1]?.value, true)}
                </div>
            </div>
        );
    }

    return null;
};

const Chart = ({data, timeframe}) => {

    return data?.length > 1 ?
        (
            <ResponsiveContainer width={'99%'} className={'select-none'}>
                <AreaChart
                    data={data}
                    margin={{top: 10, right: 30, left: 0, bottom: 20}}
                >
                    <XAxis
                        dataKey="timestamp"
                        minTickGap={30}
                        tickMargin={30}
                        tickLine={false}
                        tick={<CustomTickX timeframe={timeframe}/>}
                    />
                    <YAxis
                        minTickGap={16}
                        tickMargin={30}
                        tickLine={false}
                        tick={<CustomTickY/>}
                    />
                    <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.2)"/>
                    <Tooltip content={<CustomTooltip timeframe={timeframe}/>}/>

                    {/*<Tooltip*/}
                    {/*    contentStyle={{*/}
                    {/*        background: '#3A3E4E',*/}
                    {/*        borderRadius: '24px',*/}
                    {/*        padding: '20px',*/}
                    {/*        border: 'none',*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Area type="monotone" strokeWidth={2} dataKey="totalSupplied" stroke="#ACEF8D" fillOpacity={1}
                          fill="url(#colorSupplied)"/>
                    <Area type="monotone" strokeWidth={2} dataKey="totalBorrowed" stroke="#81C0F3" fillOpacity={1}
                          fill="url(#colorBorrowed)"/>
                    <defs>
                        <linearGradient id="colorSupplied" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#DDFFCD" stopOpacity={0.44}/>
                            <stop offset="95%" stopColor="#557845" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBorrowed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4C9CB6" stopOpacity={0.71}/>
                            <stop offset="95%" stopColor="#B9E0FF" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        ) : (
            <Spinner className={'w-full h-full flex items-center'} width={40} height={40} />
        )
}

export default Chart;
