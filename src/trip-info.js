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
		const { cost, previousCost, type } = this.props;

		return (
			<div className={styles.costs}>
				<span className={classNames({ [styles.selected]: type === 'Cheapest' })}>
					{ cost.toLocaleString() }&thinsp;€
				</span>
				{ previousCost && cost !== previousCost ? (
					<span className={styles['previous-cost']}>
						{ previousCost.toLocaleString() }&thinsp;€
					</span>
				) : null }
			</div>
		);
	}

	renderDuration() {
		const { duration, type } = this.props;

		return (
			<div className={classNames({ [styles.selected]: type === 'Fastest' })}>
				{ duration.h }&thinsp;h { duration.m }&thinsp;m
			</div>
		);
	}
}
