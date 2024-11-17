export enum BUTTON_VARIANTS {
    FILLED,
    EMPTY,
}

export const Button = ({className, variant, disabled = false, onClick, children}) => {

    const Component = () => {
        return {
            [BUTTON_VARIANTS.FILLED]: (
                <button
                    type={'button'}
                    disabled={disabled}
                    onClick={onClick}
                    className={`${className} ${disabled ? 'cursor-not-allowed' : ''} bg-gradient-to-r from-beam-primary-300 to-sky-blue text-black font-bold`}
                >
                    {children}
                </button>
            ),
            [BUTTON_VARIANTS.EMPTY]: (
                <div className={`${className} bg-gradient-to-r from-beam-primary-300 to-sky-blue p-[1px] rounded`}>
                    <button
                        type={'button'}
                        disabled={disabled}
                        onClick={onClick}
                        className={`rounded  w-full h-full bg-neutral-700 ${disabled ? 'cursor-not-allowed' : ''}`}
                    >
                        {children}
                    </button>
                </div>
            )
        }[variant]
    }

    return (<Component/>)
}