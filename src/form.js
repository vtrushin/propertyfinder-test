import React from 'react';
import Autosuggest from './autosuggest';
import { ButtonGroup, Button } from './button-group';
import styles from './form.css';

const getTripCities = data => {
    const arrivals = [];
    const departures = [];

    data.deals.forEach(({ arrival, departure }) => {
        if (!arrivals.includes(arrival)) {
            arrivals.push(arrival);
        }

        if (!departures.includes(departure)) {
            departures.push(departure);
        }
    });

    arrivals.sort();
    departures.sort();

    return { arrivals, departures };
};

const getSuggestions = (value, values) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : values.filter(value =>
        value.toLowerCase().slice(0, inputLength) === inputValue
    );
};

const renderSuggestion = suggestion => (
    <div>
        {suggestion}
    </div>
);

export default class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            departures: [],
            suggestedDepartures: [],
            departure: props.departure,
            arrivals: [],
            suggestedArrivals: [],
            arrival: props.arrival,
            isLoading: false,
            isLoaded: false,
            isError: false
        };
    }

    static getDerivedStateFromProps(props) {
        const { data } = props;

        return {
            ...getTripCities(data)
        };
    }

    render() {
        const { type } = this.props;
        const {
            suggestedDepartures, departure,
            suggestedArrivals, arrival
        } = this.state;

        return (
            <form onSubmit={this.onSubmit} className={styles.form}>
                <Autosuggest
                    suggestions={suggestedDepartures}
                    onSuggestionsFetchRequested={this.onDepartureSuggestionsRequest}
                    onSuggestionsClearRequested={this.onDepartureSuggestionsClear}
                    onSuggestionSelected={this.onDepartureSelected}
                    getSuggestionValue={value => value}
                    renderSuggestion={renderSuggestion}
                    inputProps={{
                        placeholder: 'From',
                        value: departure,
                        onChange: this.onDepartureChange
                    }}
                />
                <Autosuggest
                    suggestions={suggestedArrivals}
                    onSuggestionsFetchRequested={this.onArrivalSuggestionsRequest}
                    onSuggestionsClearRequested={this.onArrivalSuggestionsClear}
                    onSuggestionSelected={this.onArrivalSelected}
                    getSuggestionValue={value => value}
                    renderSuggestion={renderSuggestion}
                    inputProps={{
                        placeholder: 'To',
                        value: arrival,
                        onChange: this.onArrivalChange
                    }}
                />
				<ButtonGroup selected={type} onSelect={this.onTypeChange}>
					<Button value="Cheapest">Cheapest</Button>
					<Button value="Fastest">Fastest</Button>
				</ButtonGroup>
            </form>
        );
    }

    onDepartureChange = (e, { newValue }) => {
        this.setState({
            departure: newValue
        });
    };

    onDepartureSuggestionsRequest = ({ value }) => {
        const { departures } = this.state;

        this.setState({
            suggestedDepartures: getSuggestions(value, departures)
        });
    };

    onDepartureSuggestionsClear = () => {
        this.setState({
            suggestedDepartures: []
        });
    };

    onDepartureSelected = (e, { suggestion }) => {
        const { onChange } = this.props;

        onChange({ departure: suggestion });
    };

    onArrivalChange = (e, { newValue }) => {
        this.setState({
            arrival: newValue
        });
    };

    onArrivalSuggestionsRequest = ({ value }) => {
        const { arrivals } = this.state;

        this.setState({
            suggestedArrivals: getSuggestions(value, arrivals)
        });
    };

    onArrivalSuggestionsClear = () => {
        this.setState({
            suggestedArrivals: []
        });
    };

    onArrivalSelected = (e, { suggestion }) => {
        const { onChange } = this.props;

        onChange({ arrival: suggestion });
    };

    onTypeChange = value => {
        const { onChange } = this.props;

        onChange({ type: value });
    };

    onSubmit = e => {
        e.preventDefault();
    }
}
