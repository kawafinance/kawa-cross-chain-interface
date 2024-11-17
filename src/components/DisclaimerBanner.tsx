import {Button, BUTTON_VARIANTS} from "./Button";
import {capitalizeFirstLetter} from "../utils/convert";
import React from "react";

const DisclaimerBanner = ({onAccept}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-75">
            <div className='p-80 ml-60'>
            <div className="bg-neutral-700 p-6 rounded-3xl space-y-3 text-center">
                <p className="text-lg">
                    Kawa Lending Protocol is currently on beta and undergoing testing. Contracts will migrate in the
                    future.
                </p>
                <div className="flex justify-center">
                    <Button
                        className={'h-[40px] w-[112px] rounded'}
                        variant={BUTTON_VARIANTS.EMPTY}
                        disabled={false}
                        onClick={onAccept}
                    >
                        Accept
                    </Button>
                </div>
            </div>
            </div>
        </div>
    );
}

export default DisclaimerBanner