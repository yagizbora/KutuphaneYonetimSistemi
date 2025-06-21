import { useState } from "react";
import "./Clock.css";


const Clock = () => {
    let time = new Date().toLocaleTimeString()
    let date = new Date().toLocaleDateString()

    const [ctime, setTime] = useState(time)
    const [cdate, setDate] = useState(date)
    const UpdateDate = () => {
        date = new Date().toLocaleDateString()
        setDate(date)
    }
    const UpdateTime = () => {
        time = new Date().toLocaleTimeString()
        setTime(time)
    }
    setInterval(UpdateTime)
    setInterval(UpdateDate, 1000 * 60 * 60 * 24)
    return (
        <>
            <div className="clock-container">
                <p className="date-text">{cdate}</p>
                <p className="time-text">{ctime}</p>
            </div>
        </>

    )
}


export default Clock;