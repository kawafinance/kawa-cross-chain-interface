/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme'

export default {
    mode: 'jit',
    future: {
        purgeLayersByDefault: true,
        applyComplexClasses: true,
    },
    purge: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: false,
    theme: {
        screens: {
            xm: '420px',
            // => @media (min-width: 420px) { ... }

            sm: '640px',
            // => @media (min-width: 640px) { ... }

            md: '768px',
            // => @media (min-width: 768px) { ... }

            xmd: '950px',
            // => @media (min-width: 920px) { ... }

            lg: '1024px',
            // => @media (min-width: 1024px) { ... }

            xl: '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        },
        fontSize: {
            xxxs: '.55rem',
            xxs: '.75rem',
            xs: '.85rem',
            sm: '0.975rem',
            tiny: '0.975rem',
            baseline: '1rem',
            base: '1rem',
            lg: '1.225rem',
            xl: '1.35rem',
            '2xl': '1.6rem',
            '3xl': '2rem',
            '4xl': '2.35rem',
            '5xl': '3.1rem',
            '6xl': '4.1rem',
            '7xl': '5.1rem',
        },
        extend: {
            spacing: {
                72: '18rem',
                84: '21rem',
                96: '24rem',
            },
            linearBorderGradients: {
                directions: {
                    tr: 'to top right',
                    r: 'to right',
                },
                colors: {},
                background: {
                    'dark-1000': '#000',
                    'dark-900': '#080808',
                    'dark-800': '#1d1d1d',
                    'dark-pink-red': '#4e3034',
                    transparent: 'transparent',
                },
                border: {
                    1: '1px',
                    2: '2px',
                    3: '3px',
                    4: '4px',
                },
            },
            colors: {
                'sky-blue': '#72B3FF',
                'sky-blue-g': 'var(--sky-blue-g)',
                'beam-primary-100': '#EEFFE6',
                'beam-primary-200': '#DDFFCD',
                'beam-primary-300': '#CCFFB4',
                'beam-primary-300-g': 'var(--beam-primary-300-g)',
                'beam-primary-500': '#ACEF8D',
                'beam-primary-800': '#8FDE69',
                'beam-secondary-100': '#E6F4FF',
                'beam-secondary-200': '#C2E1FB',
                'beam-secondary-300': '#A0D0F7',
                'beam-secondary-500': '#81C0F3',
                'beam-secondary-800': '#094F88',
                'neutral-500': '#3A3E4E',
                'neutral-700': '#2A2C34',
                'neutral-800': '#21232C',
                'neutral-900': '#11131B',
                'neutral-1000': '#0F1219',
                'neutral-1100': '#171316',
                'negative': '#E74068',
                'warning': '#F8C01C',
                'positive-300': '#8FECDB',
                'positive-500': '#56DBC3'
            },
            lineHeight: {
                '48px': '48px',
            },
            fontFamily: {
                sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                hero: [
                    '48px',
                    {
                        letterSpacing: '-0.02em;',
                        lineHeight: '96px',
                        fontWeight: 700,
                    },
                ],
            },
            borderRadius: {
                none: '0',
                px: '1px',
                sm: '4px',
                DEFAULT: '16px',
                xl: '8px',
                '1xl': '10px',
                '2xl': '12px',
                xxl: '16px',
                '3xl': '24px',
            },
            borderWidth: {
                'DEFAULT': '1px',
            },
            borderColor: {
                'DEFAULT': '#39353D',
            },
            borderOpacity: {
                'DEFAULT': '0.5',
            },
            boxShadow: {
                'custom': '0px 14px 24px 0px rgba(44, 47, 45, 0.17)',
                swap: '0px 50px 250px -47px rgba(39, 176, 230, 0.29)',
                liquidity: '0px 50px 250px -47px rgba(123, 97, 255, 0.23)',
                'pink-glow': '0px 57px 90px -47px rgba(250, 82, 160, 0.15)',
                'blue-glow': '0px 57px 90px -47px rgba(39, 176, 230, 0.17)',
                'pink-glow-hovered': '0px 57px 90px -47px rgba(250, 82, 160, 0.30)',
                'blue-glow-hovered': '0px 57px 90px -47px rgba(39, 176, 230, 0.34)',
                'yellow-glow': '20px 20px 20px 20px rgba(75, 242, 205, 0.5)',
            },
            ringWidth: {
                DEFAULT: '1px',
            },
            padding: {
                px: '1px',
                '3px': '3px',
            },
            minHeight: {
                empty: '128px',
                cardContent: '230px',
                fitContent: 'fit-content',
            },
            dropShadow: {
                currencyLogo: '0px 3px 6px rgba(15, 15, 15, 0.25)',
            },
        },
    },
    variants: {
        linearBorderGradients: ['responsive', 'hover', 'dark'], // defaults to ['responsive']
        extend: {
            backgroundColor: ['checked', 'disabled'],
            backgroundImage: ['hover', 'focus'],
            borderColor: ['checked', 'disabled'],
            cursor: ['disabled'],
            opacity: ['hover', 'disabled'],
            placeholderColor: ['hover', 'active'],
            ringWidth: ['disabled'],
            ringColor: ['disabled'],
        },
    },
    plugins: [],
}
