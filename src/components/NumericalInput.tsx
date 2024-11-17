import { classNames, escapeRegExp } from '../utils/convert'

import React from 'react'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const defaultClassName = 'w-0 p-0 text-2xl bg-transparent'

export const Input = React.memo(
    ({
         value,
         onUserInput,
         placeholder,
         type = 'decimal',
         min = '0',
         step,
         className = defaultClassName,
         ...rest
     }: {
        value: string | number
        onUserInput: (input: string) => void
        error?: boolean
        fontSize?: string
        align?: 'right' | 'left'
    } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
        const enforcer = (nextUserInput: string) => {
            if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
                onUserInput(nextUserInput)
            }
        }

        const defaultPlaceholder = type == 'decimal' ? '0.0' : '0'
        const defaultPattern = type == 'decimal' ? '^[0-9]*[.,]?[0-9]*$' : '[0-9]'

        return (
            <input
                {...rest}
                value={value}
                onChange={(event) => {
                    // replace commas with periods, because uniswap exclusively uses period as the decimal separator
                    enforcer(event.target.value.replace(/,/g, '.'))
                }}
                // universal input options
                inputMode={type == 'decimal' ? 'decimal' : 'tel'}
                title="Token Amount"
                autoComplete="off"
                autoCorrect="off"
                // text-specific options
                type={type == 'decimal' ? 'text' : 'number'}
                step={step}
                pattern={defaultPattern}
                placeholder={placeholder || defaultPlaceholder}
                min={min}
                minLength={1}
                maxLength={79}
                spellCheck="false"
                className={classNames(
                    'relative font-bold outline-none border-none flex-auto overflow-hidden overflow-ellipsis placeholder-low-emphesis focus:placeholder-primary',
                    className
                )}
            />
        )
    }
)

Input.displayName = 'NumericalInput'

export default Input
