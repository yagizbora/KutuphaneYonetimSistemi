import { useState } from "react";
import "./Clock.css";


const Clock = () => {
    let time = new Date().toLocaleTimeString()

    const [ctime, setTime] = useState(time)

    const UpdateTime = () => {
        time = new Date().toLocaleTimeString()
        setTime(time)
    }
    setInterval(UpdateTime)
    return (
        <>
            <div className="time-container">
                <p className="time-text">{ctime}</p>
            </div>
        </>

    )
}


export default Clock;