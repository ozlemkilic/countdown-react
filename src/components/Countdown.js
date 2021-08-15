import React, { useEffect, useState } from 'react';

const Countdown = (props) => {
    let intervalId = null;
    const timeFromStorage = JSON.parse(window.localStorage.getItem('time')) || {};
    const defaultTimeData = {
        hours: timeFromStorage.hours || props.durationHour.duration_hour || 0,
        minutes: timeFromStorage.minutes || 0,
        seconds: timeFromStorage.seconds || 0
    };
    const [time, setTime] = useState(defaultTimeData);

    const startTimer = () => {
        if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
            props.changeState({ isCompleted: true });
            clearInterval(intervalId);
        } else if (time.minutes === 0 && time.seconds === 0) {
            setTime({
                hours: time.hours - 1,
                minutes: 59,
                seconds: 59
            });
        } else if (time.seconds === 0) {
            setTime({
                hours: time.hours,
                minutes: time.minutes - 1,
                seconds: 59
            });
        } else {
            setTime({
                hours: time.hours,
                minutes: time.minutes,
                seconds: time.seconds - 1
            });
        }
    };
    const addPad = data => data.toString().padStart(2, 0);

    useEffect(() => {
        setTime(defaultTimeData);
    }, [props.durationHour]);

    useEffect(() => {
        if (typeof props.durationHour === 'object' && Object.keys(props.durationHour).length !== 0) {
            intervalId = setInterval(() => startTimer(), 1000);

            window.localStorage.setItem('time', JSON.stringify(time));
        }

        return () => clearInterval(intervalId);
    }, [time]);

    return (
        <div className="duration">
            <div className="hours">
                <p>{ addPad(time.hours) }</p>
                <small className="duration-text">Hours</small>
            </div>
            <span>:</span>
            <div className="minutes">
                <p>{ addPad(time.minutes) }</p>
                <small className="duration-text">Minutes</small>
            </div>
            <span>:</span>
            <div className="seconds">
                <p>{ addPad(time.seconds) }</p>
                <small className="duration-text">Seconds</small>
            </div>
        </div>
    )
}

export default Countdown;
