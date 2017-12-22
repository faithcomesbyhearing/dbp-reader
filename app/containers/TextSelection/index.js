/**
 *
 * TextSelection
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LanguageList from 'components/LanguageList';
import VersionList from 'components/VersionList';
import menu from 'images/menu.svg';
import {
	setVersionListState,
	setLanguageListState,
	setActiveIsoCode,
	setBookListState,
	getBooks,
	getLanguages,
	getTexts,
	setActiveText,
} from './actions';
import makeSelectTextSelection, { selectLanguages, selectTexts } from './selectors';
import reducer from './reducer';
import saga from './saga';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

export class TextSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		const { activeTextId } = this.props.textselection;
		// TODO: use a conditional to ensure the actions below only happen on the first mount
		this.props.dispatch(getBooks({ textId: activeTextId }));
		this.props.dispatch(getLanguages());
		this.props.dispatch(getTexts());
	}

	getBooksForText = ({ textId }) => this.props.dispatch(getBooks({ textId }));

	setBookListState = ({ state }) => this.props.dispatch(setBookListState({ state }));

	setActiveIsoCode = ({ iso, name }) => this.props.dispatch(setActiveIsoCode({ iso, name }));

	setActiveText = ({ textName, textId }) => this.props.dispatch(setActiveText({ textName, textId }));

	toggleLanguageList = ({ state }) => this.props.dispatch(setLanguageListState({ state }));

	toggleVersionList = ({ state }) => this.props.dispatch(setVersionListState({ state }));

	render() {
		const {
			activeIsoCode,
			languageListActive,
			versionListActive,
			activeLanguageName,
			bookTableActive,
			activeTextName,
		} = this.props.textselection;
		const {
			bibles,
			languages,
			toggleVersionSelection,
		} = this.props;
		let sectionTitle = 'LANGUAGE';
		if (versionListActive) {
			sectionTitle = 'VERSION';
		} else if (bookTableActive) {
			sectionTitle = 'BOOK';
		}
		return (
			<aside className="settings">
				<header>
					<h2 className="text-selection">{`${sectionTitle} SELECTION`}</h2>
					<span role="button" tabIndex={0} className="close-icon" onClick={toggleVersionSelection}>
						<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
					</span>
				</header>
				<LanguageList active={languageListActive} setBookListState={this.setBookListState} toggleVersionList={this.toggleVersionList} activeLanguageName={activeLanguageName} toggleLanguageList={this.toggleLanguageList} languages={languages} setActiveIsoCode={this.setActiveIsoCode} />
				<VersionList active={versionListActive} setBookListState={this.setBookListState} activeTextName={activeTextName} toggleVersionList={this.toggleVersionList} activeIsoCode={activeIsoCode} setActiveText={this.setActiveText} getBooksForText={this.getBooksForText} bibles={bibles} toggleLanguageList={this.toggleLanguageList} />
			</aside>
		);
	}
}

TextSelection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	bibles: PropTypes.object,
	languages: PropTypes.object,
	textselection: PropTypes.object,
	toggleVersionSelection: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
	textselection: makeSelectTextSelection(),
	languages: selectLanguages(),
	bibles: selectTexts(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'textSelection', reducer });
const withSaga = injectSaga({ key: 'textSelection', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(TextSelection);
