import { useEffect, useState } from 'react';
import './style.scss';
import image from './assets/images/top_image_scale_1x.png';
import imageRetina from './assets/images/top_image_scale_2x.png';

function App() {
    const [data, setData]=useState({});
    const timeFromStorage = JSON.parse(window.localStorage.getItem('time')) || {};
    const [time, setTime] = useState({
        hours: timeFromStorage.hours || data.duration_hour || 0,
        minutes: timeFromStorage.minutes || 0,
        seconds: timeFromStorage.seconds || 0
    });
    const [isCompleted, setCountdownStatus] = useState(false);

    const startTimer = () => {
        if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
            setCountdownStatus(true);
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
    const readFile = () => {
        import('./data')
            .then(({ data }) => {
                setData(data);
            })
            .catch(() => setData({ duration_hour: 0, url: '', cash_value: 0 }));
    };

    useEffect(() => {
        readFile();
    }, []);
    useEffect(() => {
        setTime({
            hours: timeFromStorage.hours || data.duration_hour || 0,
            minutes: timeFromStorage.minutes || 0,
            seconds: timeFromStorage.seconds || 0
        });
    }, [data]);
    useEffect(() => {
        let intervalId = null;

        if (typeof data === 'object' && Object.keys(data).length !== 0) {
            intervalId = setInterval(() => startTimer(), 1000);

            window.localStorage.setItem('time', JSON.stringify(time));
        }

        return () => clearInterval(intervalId);
    }, [time]);

    return (
        <div className="countdown">
            <section className="container">
                {!isCompleted &&
                    <div className="description">
                        <img
                            src={image}
                            srcSet={`${image} 1x, ${imageRetina} 2x`}
                            alt="top-image"
                        />
                        <p>Get your free £{data.cash_value || 0} now</p>
                    </div>
                }
                <div className="duration">
                    <div>
                        <p>{ addPad(time.hours) }</p>
                        <p className="duration-text">Hours</p>
                    </div>
                    <span>:</span>
                    <div>
                        <p>{ addPad(time.minutes) }</p>
                        <p className="duration-text">Minutes</p>
                    </div>
                    <span>:</span>
                    <div>
                        <p>{ addPad(time.seconds) }</p>
                        <p className="duration-text">Seconds</p>
                    </div>
                </div>
                {!isCompleted && <a href={data.url || ''} target="_blank">Opt-in</a>}
            </section>
        </div>
    );
};

export default App;
