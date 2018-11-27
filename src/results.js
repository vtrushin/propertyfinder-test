import React from 'react';
import shortestPath from './shortest-path';
import TripInfo from './trip-info';
import styles from './results.css';
import busImage from './images/bus.svg';
import carImage from './images/car.svg';
import trainImage from './images/train.svg';

const transportMap = {
    bus: {
        title: 'Bus',
		image: { src: busImage, width: 16, height: 19 }
    },
    car: {
        title: 'Car',
		image: { src: carImage, width: 16, height: 14 }
    },
    train: {
        title: 'Train',
		image: { src: trainImage, width: 13, height: 19 }
    }
};

const round = num => Math.round(num * 100) / 100;

const getCost = trip => trip.discount ? trip.cost - round(trip.discount / 100) * trip.cost : trip.cost;

const durationToMinutes = duration => Number(duration.h) * 60 + Number(duration.m);

const minutesToDuration = minutes => ({ h: Math.floor(minutes / 60), m: minutes % 60 });

/**
 * Preparing data for making graph
 * @param {Array} trips Array of trips
 * @param {Function} getter Getter function to count weight
 * @returns {object}
 */
const prepareMap = (trips, getter) => {
    return trips.reduce((acc, trip) => {
    	const { departure, arrival } = trip;
        const newAcc = !acc[departure] ? { ...acc, [departure]: {} } : acc;

        return {
            ...newAcc,
            [departure]: {
                ...newAcc[departure],
                [arrival]: getter(trip)
            }
        };
    }, {});
};

export default class Results extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			stops: [],
			trips: []
		};
	}

	static getDerivedStateFromProps(props) {
		const { data, departure, arrival, type } = props;

		// Remove duplicates with larger values
		const trips = data.deals.filter((trip, index) => {
			const duplicate = data.deals.find((deal, dealIndex) => (
				index !== dealIndex
				&& deal.departure === trip.departure
				&& deal.arrival === trip.arrival
			));

			return duplicate ? (
				type === 'Cheapest'
					? getCost(trip) < getCost(duplicate)
					: durationToMinutes(trip.duration) <= durationToMinutes(duplicate.duration)
			) : true;
		});

		const getter = type === 'Cheapest'
			? trip => getCost(trip)
			: trip => durationToMinutes(trip.duration);

		const map = prepareMap(trips, getter);

		const stops = shortestPath(map, departure, arrival);

		return {
			stops,
			trips
		};
	}

    render() {
        const { departure, arrival, type } = this.props;
        const { trips, stops } = this.state;

        if (!departure || !arrival) {
            return null;
        }

		const total = stops.reduce((acc, stop, i) => {
			if (i === 0) {
				return acc;
			}

			const trip = trips.find(trip => stops[i - 1] === trip.departure && stop === trip.arrival);

			return {
				cost: acc.cost + getCost(trip),
				duration: acc.duration + durationToMinutes(trip.duration)
			};
		}, { cost: 0, duration: 0 });

		return (
            <div className={styles.results}>
                <div className={styles.path}>
                   	{ this.renderPath() }
                </div>
				<div className={styles.footer}>
					<TripInfo type={type} cost={total.cost} duration={minutesToDuration(total.duration)} />
				</div>
            </div>
        )
    }

    renderPath() {
        const { stops } = this.state;

        return stops.reduce((acc, stop, i) => {
            const renderedStop = i === stops.length - 1 ? this.renderMainTripStop(stop) : this.renderTripStop(stop);

            return i === 0
                ? [...acc, this.renderMainTripStop(stop)]
                : [...acc, this.renderTrip(stops[i - 1], stop), renderedStop]
        }, []);
    }

    renderMainTripStop(name) {
        return (
            <div key={name} className={styles['main-trip-stop']}>
				<div>{ name }</div>
            </div>
        );
    }

    renderTripStop(name) {
        return (
            <div key={name} className={styles['trip-stop']}>
				<div>{ name }</div>
            </div>
        );
    }

    renderTrip(prevStop, nextStop) {
        const { type } = this.props;
        const { trips } = this.state;

		const trip = trips.find(trip => prevStop === trip.departure && nextStop === trip.arrival);
		const transport = transportMap[trip.transport];

        return (
            <div key={`${prevStop}_${nextStop}`} className={styles.trip}>
				<div
					className={styles['transport-icon']}
					style={{
						marginLeft: - transport.image.width / 2,
						marginTop: - transport.image.height / 2
					}}
				>
					<img src={transport.image.src} />
				</div>
				<div className={styles['trip-body']}>
					<div className={styles['trip-body__row']}>
						<TripInfo type={type} cost={getCost(trip)} duration={trip.duration} />
					</div>
					<div className={styles['trip-body__row']}>
						<div className={styles.transport}>
							{ transport.title }, { trip.reference }
						</div>
					</div>
				</div>
            </div>
        );
    }
}

