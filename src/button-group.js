import React from 'react';
import classNames from 'classnames';
import styles from './button-group.css';

const empty = () => null;

export const Button = ({ children, value, onClick = empty, groupPosition = null, selected = false }) => {
	const className = classNames(
		styles.button,
		styles['_' + groupPosition],
		{ [styles['_selected']]: selected }
	);

	return (
		<button className={className} onClick={() => onClick(value)}>
			{ children }
		</button>
	);
};

export const ButtonGroup = ({ children, selected, onSelect = empty }) => {
	const mappedChildren = React.Children.map(children, (Button, i) => {
		let groupPosition;

		if (i === 0) {
			groupPosition = 'first';
		} else if (i === children.length - 1) {
			groupPosition = 'last';
		} else {
			groupPosition = 'middle';
		}

		return React.cloneElement(Button, {
			selected: selected === Button.props.value,
			onClick: onSelect,
			groupPosition
		});
	});

	return (
		<div className={styles['button-group']}>
			{ mappedChildren }
		</div>
	);
};
