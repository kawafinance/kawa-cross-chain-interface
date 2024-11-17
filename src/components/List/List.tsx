import Dots from '../Dots'
import ListItem from './ListItem'
import React from 'react'
import useSortableData from '../../hooks/useSortableData'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import Typography from "../Typography";
import { TYPES } from "../../pages/panel";
import Spinner from "../Spinner";
import useIsMobile from "../../hooks/useIsMobile.ts";

const SortDirection = ({ sortConfig, sortKey }) => {
    return (
        <>
            {sortConfig &&
                sortConfig.key === sortKey &&
                ((sortConfig.direction === 'ascending' && <ChevronUpIcon width={12} height={12} />) ||
                    (sortConfig.direction === 'descending' && <ChevronDownIcon width={12} height={12} />))}
        </>
    )
}

const List = ({ farms, term, type }) => {
    const isMobile = useIsMobile()
    const { items, sortConfig, requestSort } = useSortableData(farms)

    return items ? (
        <div className={'w-full h-auto bg-neutral-800'}>
            <div className="space-y-6">
                <div className='text-start text-xl font-semibold'>
                    {type === TYPES.DEPOSIT ? 'Deposits' : 'Borrowings'}
                </div>
                <div>
                    <div className='grid md:grid-cols-9 grid-cols-4 w-11/12 h-auto text-white text-opacity-30 font-semibold p-1 items-end'>
                        <div className='md:col-span-3 col-span-1 flex space-x-2 pl-2'>
                            Asset
                        </div>
                        <div
                            className='md:col-span-2 col-span-1 flex cursor-pointer hover:text-white hover:text-opacity-90 space-x-2 justify-end'
                            onClick={() => requestSort(type == TYPES.DEPOSIT ? 'userCollateral' : 'userDebt')}
                        >
                            <SortDirection sortConfig={sortConfig} sortKey={
                                type == TYPES.DEPOSIT ? 'userCollateral' : 'userDebt'}
                            />
                            <div>{type === TYPES.DEPOSIT ? 'Deposited' : 'Borrowed'}</div>
                        </div>
                        <div className='md:col-span-2 col-span-1 flex flex-col items-end space-x-2 justify-end'>
                            <div>{ type === TYPES.DEPOSIT ? isMobile ? 'Total' : 'Total Supplied' : isMobile ? 'Liq.' : 'Market Liq.'}</div>
                        </div>
                        <div
                            className='md:col-span-2 col-span-1 flex px-4 cursor-pointer hover:text-white hover:text-opacity-90 space-x-2 justify-end'
                            onClick={() => requestSort('roiPerYear')}
                        >
                            <SortDirection sortConfig={sortConfig} sortKey={
                                type == TYPES.DEPOSIT ? 'supplyAPY' : 'borrowRate'
                            } />
                            <div>
                                {
                                    type == TYPES.DEPOSIT
                                        ? 'APY'
                                        : 'Rate'
                                }
                            </div>
                        </div>
                    </div>
                    <div className='flex-col mt-2 space-y-3'>
                        {items.map((farm, index) => (
                            <ListItem key={index} farm={farm} type={type}/>
                        ))}
                        {items.length == 0 && (
                            <Spinner className={'w-full h-full flex items-center'} width={20} height={20}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className='w-full py-6 text-center'>
            {term ? <span>No Results</span> : <Dots>Loading</Dots>}
        </div>
    )
}

export default List
