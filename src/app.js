import React from 'react';
import data from './data/response.json';
import Form from './form';
import Results from './results';
import styles from './app.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            departure: 'Brussels',
            arrival: 'Moscow',
            type: 'Cheapest'
        };
    }

    render() {
        const { departure, arrival, type } = this.state;

        return (
            <div>
                <div className={styles.screens}>
                    <div className={styles.screen}>
                        <Form data={data} type={type} departure={departure} arrival={arrival} onChange={this.onChangeFilters} />
                    </div>
                    <div className={styles.screen}>
                        <Results departure={departure} arrival={arrival} data={data} type={type} />
                    </div>
                </div>
            </div>
        )
    }

    onChangeFilters = filters => {
        this.setState({ ...filters });
    }
}
