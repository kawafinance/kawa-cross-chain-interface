import {useEffect, useState} from "react";
import {XMarkIcon} from '@heroicons/react/24/outline'

const Banner = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('bannerClosed') === 'true') {
            setIsVisible(false);
        }else{
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false)
        localStorage.setItem('bannerClosed', 'true');
    }

    if (!isVisible) {
        return <></>
    } else {
        return (
            <div
                className="flex flex-col justify-between items-start w-full bg-gradient-to-r from-beam-primary-300 to-sky-blue rounded p-6 mx-auto">
                <div className="flex w-full">
                    <span
                        className="flex-grow md:inline text-xl font-bold text-neutral-1000 leading-8 tracking-normal text-left">
                        Borrow & Lend
                    </span>
                    <div className="-mr-5 -mt-5">
                        <button
                            type="button"
                            className="flex p-2.5 focus:outline-none"
                            onClick={handleClose}
                        >
                            <span className="sr-only">Dismiss</span>
                            <XMarkIcon className="w-5 h-5 text-neutral-1000" aria-hidden="true"/>
                        </button>
                    </div>
                </div>
                <p className="inline">
                    <span className="md:inline text-neutral-500">
                        Introducing decentralised cross-chain lending. Access the potential of blockchain assets between multiple chains. Our rates are algorithmically based on supply and demand.
                    </span>
                </p>
            </div>
        )
    }
}

export default Banner