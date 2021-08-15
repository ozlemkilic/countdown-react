import React, {Component} from 'react';
import Countdown from './components/Countdown';
import './style.scss';
import image1x from './assets/images/top_image_scale_1x.png';
import image2x from './assets/images/top_image_scale_2x.png';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            isCompleted: false
        };
    }

    readFile = () => {
        fetch('data.json')
            .then(response => { response.json()
                .then(data => {
                    this.setState({ data });
                })
                .catch(() => this.setState({ data: { duration_hour: 0, url: '', cash_value: 0 } }));
            });
    };

    componentDidMount() {
        this.readFile();
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
                    <Countdown durationHour={this.state.data.duration_hour} changeState={(state) => this.setState(state)} />
                    {!this.state.isCompleted && <a href={this.state.data.url || ''} target="_blank">Opt-in</a>}
                </section>
            </div>
        );
    }
}

export default App;
