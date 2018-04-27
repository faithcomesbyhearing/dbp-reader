/**
*
* SettingsToggle
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
/* eslint-disable jsx-a11y/label-has-for */
function SettingsToggle({ action, name, checked, available }) {
	return (
		<div className={available ? 'checkbox-settings' : 'checkbox-settings disabled'}>
			<label className={checked ? 'active' : ''}>
				<FormattedMessage {...messages[name]} />
				<div className="switch">
					<input
						type="checkbox"
						checked={checked}
						onChange={(e) => {
							if (!available) {
								e.preventDefault();
							} else if (available) {
								action({ name });
							}
						}}
					/>
					<span className="slider"></span>
				</div>
			</label>
		</div>
	);
}

SettingsToggle.propTypes = {
	action: PropTypes.func,
	name: PropTypes.string,
	checked: PropTypes.bool,
	available: PropTypes.bool,
};

export default SettingsToggle;
