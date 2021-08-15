import React, {Component} from 'react';
import './style.scss';
import image1x from './assets/images/top_image_scale_1x.png';
import image2x from './assets/images/top_image_scale_2x.png';

class App extends Component {
    constructor(props) {
        super(props);

        this.timeFromStorage = JSON.parse(window.localStorage.getItem('time')) || {};
        this.state = {
            data: {},
            time: {
                hours: this.timeFromStorage.hours || 0,
                minutes: this.timeFromStorage.minutes || 0,
                seconds: this.timeFromStorage.seconds || 0
            },
            isCompleted: this.timeFromStorage.hours === 0
        };
        this.intervalId = null;
    }

    readFile = () => {
        fetch('data.json')
            .then(response => { response.json()
                .then(data => {
                    this.setState({ data });
                    this.setState({ time: {
                            hours: this.timeFromStorage.hours || this.state.data.duration_hour || 0,
                            minutes: this.timeFromStorage.minutes || 0,
                            seconds: this.timeFromStorage.seconds || 0
                        }}, () => {
                        this.intervalId = setInterval(() => this.startTimer(), 1000);
                    });
                })
                .catch(() => this.setState({ data: { duration_hour: 0, url: '', cash_value: 0 } }));
            });
    };
    startTimer = () => {
        if (this.state.time.hours === 0 && this.state.time.minutes === 0 && this.state.time.seconds === 0) {
            this.setState({ isCompleted: true });
            clearInterval(this.intervalId);
        } else if (this.state.time.minutes === 0 && this.state.time.seconds === 0) {
            this.setState({
                time: {
                    hours: this.state.time.hours - 1,
                    minutes: 59,
                    seconds: 59
                }
            });
        } else if (this.state.time.seconds === 0) {
            this.setState({
                time: {
                    hours: this.state.time.hours,
                    minutes: this.state.time.minutes - 1,
                    seconds: 59
                }
            });
        } else {
            this.setState({
                time: {
                    hours: this.state.time.hours,
                    minutes: this.state.time.minutes,
                    seconds: this.state.time.seconds - 1
                }
            });
        }

        window.localStorage.setItem('time', JSON.stringify(this.state.time));
    };
    addPad = data => data.toString().padStart(2, 0);

    componentDidMount() {
        this.readFile();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        return (
            <div className="countdown">
                <section className="container">
                    {!this.state.isCompleted &&
                    <div className="description">
                        <img
                            src={image1x}
                            srcSet={`${image1x} 1x, ${image2x} 2x`}
                            alt="top-image"
                        />
                        <p>Get your free £{this.state.data.cash_value || 0} now</p>
                    </div>
                    }
                    <div className="duration">
                        <div className="hours">
                            <p>{ this.addPad(this.state.time.hours) }</p>
                            <small className="duration-text">Hours</small>
                        </div>
                        <span>:</span>
                        <div className="minutes">
                            <p>{ this.addPad(this.state.time.minutes) }</p>
                            <small className="duration-text">Minutes</small>
                        </div>
                        <span>:</span>
                        <div className="seconds">
                            <p>{ this.addPad(this.state.time.seconds) }</p>
                            <small className="duration-text">Seconds</small>
                        </div>
                    </div>
                    {!this.state.isCompleted && <a href={this.state.data.url || ''} target="_blank">Opt-in</a>}
                </section>
            </div>
        );
    }
}

export default App;
