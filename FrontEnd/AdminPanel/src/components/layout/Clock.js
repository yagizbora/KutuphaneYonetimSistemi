import { useState, useEffect } from "react";
import "./Clock.css";

const Clock = () => {
    const [ctime, setTime] = useState(() => new Date().toLocaleTimeString());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="time-container clock-badge">
            <p className="time-text">{ctime}</p>
        </div>
    );
};

export default Clock;
