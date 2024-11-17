import {useEffect, useState} from "react";

function useIsMobile() {
    const mobileLimit = 768
    const [isMobile, setIsMobile] = useState(window.innerWidth < mobileLimit);
    useEffect(() => {
        const handleResize = () => {
            const mobileView = window.innerWidth < mobileLimit;
            setIsMobile(mobileView);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isMobile
}

export default useIsMobile