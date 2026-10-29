import { useState, useEffect } from "react";
import "./Clock.css";

const CurrentDate = () => {
    const [cdate, setDate] = useState(() => new Date().toLocaleDateString());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDate(new Date().toLocaleDateString());
        }, 1000 * 60);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="time-container date-badge">
            <p className="date-text">{cdate}</p>
        </div>
    );
};

export default CurrentDate;
