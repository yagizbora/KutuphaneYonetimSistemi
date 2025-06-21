import { useState } from "react";
import "./Clock.css";

const CurrentDate = () => {

    let date = new Date().toLocaleDateString()


    const [cdate, setDate] = useState(date)
    const UpdateDate = () => {
        date = new Date().toLocaleDateString()
        setDate(date)
    }

    setInterval(UpdateDate, 1000 * 60 * 60 * 24)
    return (
        <>
            <div className="clock-container">
                <p className="date-text">{cdate}</p>
            </div>
        </>

    )
}


export default CurrentDate;