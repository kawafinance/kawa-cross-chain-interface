
export const ChartTimeframeSelector = ({timeframeOptions, value, onSelect}) =>{
    return (
        <div className={'flex items-center'}>
            {timeframeOptions?.map(opt => (
                <div
                    key={opt}
                    className={`${value === opt ? 'bg-neutral-500' : 'text-opacity-50'} text-white cursor-pointer rounded-xl p-2`}
                    onClick={()=> onSelect(opt)}
                >
                    {opt}
                </div>
                ))}
        </div>
    )
}