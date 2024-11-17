import {useNavigate, useLocation} from 'react-router-dom'
import React from "react";

type NavigationItemProps = {
    title: string
    active?: boolean
    onClick: () => void
    children?: React.ReactNode
}

const NavigationItem = ({title, active, onClick, children}: NavigationItemProps) => {
    return (
        <div
            className={`flex flex-row cursor-pointer ${active ? 'rounded-3xl bg-white bg-opacity-5' : ''}`}
            onClick={onClick}
        >
            <div className="p-4">
                {children}
            </div>
            <div className="pt-4">
                <div className='text-l font-bold'> {title}</div>
            </div>
        </div>
    )
}

export const Navigation = ({className}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const socialImgClass = 'w-9 h-9 p-2'
    return (
        <div className={`${className} p-6 pt-6 h-full flex flex-col`}>
            <div className="flex space-x-4">
                <div className="w-[40px] h-[40px] top-[24px] left-[23px]">
                    <img src={'/images/kawa.png'} alt="Kawa" className=""/>
                </div>
                <div className="w-[63px] h-[29px] top-[27px] left-[72px]">
                    <div className='text-2xl font-bold'>Kawa</div>
                </div>
            </div>
            <div className='h-20'>
            </div>
            <div className={'pb-10'}>
                {/*<NavigationItem*/}
                {/*    title={'Overview'}*/}
                {/*    active={location.pathname == '/'}*/}
                {/*    onClick={*/}
                {/*        () => navigate('/')*/}
                {/*    }>*/}
                {/*    <img src={'/images/overview-icon.svg'} alt={"overview"}/>*/}
                {/*</NavigationItem>*/}
                <NavigationItem
                    title={'Borrow & Lend'}
                    active={location.pathname == '/lend'}
                    onClick={
                        () => navigate('/lend')
                    }>
                    <img src={'/images/borrow-lend-graph-icon.svg'} alt={"borrow lend"}/>
                </NavigationItem>
                {/*<NavigationItem*/}
                {/*    title={'Fees & Rewards'}*/}
                {/*    active={location.pathname == '/rewards'}*/}
                {/*    onClick={*/}
                {/*        () => navigate('/rewards')*/}
                {/*    }>*/}
                {/*    <img src={'/images/rewards-icon.svg'} alt={"rewards"}/>*/}
                {/*</NavigationItem>*/}
                {/*<NavigationItem*/}
                {/*    title={'Leaderboard'}*/}
                {/*    active={location.pathname == '/leaderboard'}*/}
                {/*    onClick={*/}
                {/*        () => navigate('/leaderboard')*/}
                {/*    }>*/}
                {/*    <img src={'/images/leaderboard-icon.svg'} alt={"leaderboard"} />*/}
                {/*</NavigationItem>*/}
            </div>
            <div className="flex-grow">
                <div className="flex flex-col justify-end h-full">
                    <div className="flex flex-row justify-between p-2">
                        <a
                            href="https://discord.com/invite/gkD3xP6vBF"
                            target="_blank"
                        >
                            <img src="/images/icon-discord.svg" className={socialImgClass}/>
                        </a>
                        <a
                            href="https://t.co/Mphl3n2XBv"
                            target="_blank"
                        >
                            <img src="/images/icon-telegram.svg" className={socialImgClass}/>
                        </a>
                        <a
                            href="https://twitter.com/kawafinance"
                            target="_blank"
                        >
                            <img src="/images/icon-twitter.svg" className={socialImgClass}/>
                        </a>
                        <a
                            href="https://medium.com/@kawa_fi"
                            target="_blank"
                        >
                            <img src="/images/icon-medium.svg" className={socialImgClass}/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}