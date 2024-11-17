import React, {ReactNode, useEffect, useState} from 'react'
import {Header} from "./Header";
import {Navigation} from "./Navigation";
import useIsMobile from "../hooks/useIsMobile";

type Props = {
    children?: ReactNode
    title?: string
}

const Layout = ({children}: Props) => {
    const isMobile = useIsMobile()

    return (
        <>
            <div className="w-screen flex h-screen overflow-hidden">
                {!isMobile && (
                    <div className={'border-r'}>
                        <Navigation
                            className={"md:w-[277px] h-full md:border-r"}
                        />
                    </div>
                )}
                <div className={'flex flex-grow flex-col p-8 gap-6 items-center'}>
                    <div className={'w-full h-full flex flex-col'}>
                        <Header/>
                        <div className={'flex-grow h-full overflow-auto'}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            {/*<AssosciateModal/>// todo*/}
        </>
    )
}

export default Layout
