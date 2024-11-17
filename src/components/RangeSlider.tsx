import React, {useRef} from "react";
import Tippy from "@tippyjs/react";

const RangeSlider = ({percentage, onPercentageChange, tippyDisabled = true}) => {
    const isDragging = useRef(false);
    const barRef = useRef(null);

    const handleBarClick = (e) => {
        if (!isDragging.current && barRef.current) {
            const rect = (barRef.current as HTMLElement).getBoundingClientRect();
            const x = e.clientX - rect.left;
            const clickedPosition = Math.max(0, Math.min(x, rect.width));
            onPercentageChange((clickedPosition / (barRef.current as HTMLElement).getBoundingClientRect().width) * 100);
        }
    };


    const handleDragStart = (e) => {
        e.preventDefault();
        isDragging.current = true;
        document.addEventListener("mousemove", handleDragMove);
        document.addEventListener("mouseup", handleDragEnd);
    };

    const handleDragMove = (e) => {
        if (barRef.current) {
            const rect = (barRef.current as HTMLElement).getBoundingClientRect();
            const x = e.clientX - rect.left;

            // Constrain the value between 0 and the width of the bar
            const constrainedX = Math.min(Math.max(x, 0), rect.width);

            // Update the internal progress state for the visual effect
            onPercentageChange((constrainedX / rect.width) * 100);
        }
    };

    const handleDragEnd = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragEnd);
    };

    return (
        <Tippy
            content={
                <div className={'rounded p-4 bg-gradient-to-r from-beam-primary-300-g to-sky-blue-g text-black'}>
                    Your transaction may fail, if you try to deposit your max balance of the fee token.
                </div>
            }
            visible={true}
            disabled={tippyDisabled}
        >

            <div className="relative w-full h-10 flex items-center px-10 select-none">
                <span
                    className="absolute left-0 text-white opacity-50 cursor-pointer"
                    onClick={() => onPercentageChange(0)}
                >
                    Min
                </span>

                <div
                    ref={barRef}
                    className="relative flex-grow h-1 bg-opacity-10 bg-white rounded-3xl cursor-pointer mx-4"
                    onClick={handleBarClick}
                >
                    <div
                        style={{width: `${percentage}%`}}
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-beam-primary-300 to-sky-blue rounded-3xl"
                    ></div>
                    <div
                        style={{left: `${percentage}%`}}
                        className="absolute w-6 h-6 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 group"
                        onMouseDown={handleDragStart}
                    >
                        <span
                            className="text-sm absolute -top-8 -left-1/2 transform translate-x-1/2 text-white bg-neutral-500 px-2 py-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {Math.round(percentage)}%
                        </span>
                    </div>
                    <div className="absolute left-0 bottom-[-20px] flex justify-between w-full">
                        <div
                            key={0}
                            onClick={(e) => {
                                e.stopPropagation()
                                onPercentageChange(0)
                            }}
                            className="w-2 h-2 -ml-1 bg-white bg-opacity-50 rounded-full cursor-pointer transform hover:scale-110 transition-transform"
                        ></div>
                        {[25, 50, 75].map((val, idx) => (
                            <div
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onPercentageChange(val)
                                }}
                                className="w-2 h-2 bg-white bg-opacity-50 rounded-full cursor-pointer transform hover:scale-110 transition-transform"
                            ></div>
                        ))}
                        <div
                            key={100}
                            onClick={(e) => {
                                e.stopPropagation()
                                onPercentageChange(100)
                            }}
                            className="w-2 h-2 -mr-1 bg-white bg-opacity-50 rounded-full cursor-pointer transform hover:scale-110 transition-transform"
                        ></div>
                    </div>
                </div>

                <span
                    className="absolute right-0 text-white opacity-50  cursor-pointer"
                    onClick={() => onPercentageChange(100)}
                >
                    Max
                </span>
            </div>
        </Tippy>
    );
};

export default RangeSlider;
