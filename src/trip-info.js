import React, { Fragment } from 'react';
import classNames from 'classnames';
import styles from './trip-info.css';

export default class TripInfo extends React.Component {
	render() {
		const { type } = this.props;

		return (
			<div className={styles['trip-info']}>
				{ type === 'Cheapest'
					? (
						<Fragment>
							{ this.renderPrice() }
							{ this.renderDuration() }
						</Fragment>
					) : (
						<Fragment>
							{ this.renderDuration() }
							{ this.renderPrice() }
						</Fragment>
					) }
			</div>
		)
	}

	renderPrice() {
		const { cost, type } = this.props;

		return (
			<div className={classNames(styles.price, { [styles.selected]: type === 'Cheapest' })}>
				{ cost.toLocaleString() }&thinsp;€
			</div>
		);
	}

	renderDuration() {
		const { duration, type } = this.props;

		return (
			<div className={classNames(styles.duration, { [styles.selected]: type === 'Fastest' })}>
				{ duration.h }&thinsp;h { duration.m }&thinsp;m
			</div>
		);
	}
}
