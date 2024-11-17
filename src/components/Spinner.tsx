const Spinner = ({width, height, className}) => {
    return (
        <div className={className}>
            <img className={`w-${width} h-${height} animate-spin mx-auto`} src={'/images/spinner.svg'} alt={"down-icon"}/>
        </div>
    )
}

export default Spinner