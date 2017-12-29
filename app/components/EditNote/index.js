/**
*
* EditNote
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

class EditNote extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<div>
				<FormattedMessage {...messages.header} />
			</div>
		);
	}
}

EditNote.propTypes = {

};

export default EditNote;
