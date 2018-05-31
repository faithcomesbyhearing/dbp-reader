/**
 *
 * Notes
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
// import isEqual from 'lodash/isEqual';
import SvgWrapper from 'components/SvgWrapper';
import EditNote from 'components/EditNote';
import MyNotes from 'components/MyNotes';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
import {
	setActiveNote,
	deleteHighlights,
} from 'containers/HomePage/actions';
import {
	setActiveChild,
	setPageSize,
	toggleVerseText,
	toggleAddVerseMenu,
	togglePageSelector,
	setActivePage,
	addNote,
	getNotesForNotebook,
	getChapterForNote,
	addHighlight,
	updateNote,
	deleteNote,
	getUserBookmarkData,
	readSavedMessage,
	updateHighlight,
	clearNoteErrorMessage,
	getUserHighlights,
} from './actions';
import makeSelectNotes, {
	selectUserId,
	selectActiveNote,
	selectHighlightedText,
	selectUserAuthenticationStatus,
	selectNotePassage,
	selectActiveTextId,
	vernacularBookNameObject,
	// selectHighlights,
	// selectListData,
	selectActiveBookName,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

export class Notes extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		this.props.dispatch(setActiveChild(props.openView));
	}
	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(this.ref, this.props.toggleNotesModal);
		this.closeMenuController.onMenuMount();
		// console.log('Notes mounted');
		// document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
		// document.removeEventListener('click', this.handleClickOutside);
	}

	setRef = (node) => {
		this.ref = node;
	}

	setActiveChild = (child) => this.props.dispatch(setActiveChild(child))
	setActivePage = (props) => this.props.dispatch(setActivePage({ userId: this.props.userId, params: { ...props } }))
	setActiveNote = ({ note }) => {
		this.props.dispatch(getChapterForNote({ note }));
		this.props.dispatch(setActiveNote({ note }));
	}
	setPageSize = (props) => this.props.dispatch(setPageSize({ userId: this.props.userId, params: { ...props } }))
	getNotes = (props) => this.props.dispatch(getNotesForNotebook({ userId: this.props.userId, params: { ...props } }))
	getBookmarks = (props) => this.props.dispatch(getUserBookmarkData({ userId: this.props.userId, params: { ...props } }))
	getHighlights = (props) => this.props.dispatch(getUserHighlights({ userId: this.props.userId, params: { ...props } }))
	toggleVerseText = () => this.props.dispatch(toggleVerseText())
	toggleAddVerseMenu = () => this.props.dispatch(toggleAddVerseMenu())
	togglePageSelector = () => this.props.dispatch(togglePageSelector())
	addHighlight = (data) => this.props.dispatch(addHighlight({ userId: this.props.userId, data }))
	updateHighlight = (props) => this.props.dispatch(updateHighlight({
		userId: this.props.userId,
		bible: this.props.activeTextId,
		book: this.props.activeBookId,
		chapter: this.props.activeChapter,
		...props,
	}))
	deleteHighlights = (props) => this.props.dispatch(deleteHighlights({
		userId: this.props.userId,
		bible: this.props.activeTextId,
		book: this.props.activeBookId,
		chapter: this.props.activeChapter,
		...props,
	}))
	addNote = (data) => this.props.dispatch(addNote({ userId: this.props.userId, data: { ...data, user_id: this.props.userId } }))
	updateNote = (data) => this.props.dispatch(updateNote({ userId: this.props.userId, noteId: data.id, data: { ...data, user_id: this.props.userId } }))
	deleteNote = ({ noteId }) => this.props.dispatch(deleteNote({ userId: this.props.userId, noteId, pageSize: this.props.notes.pageSize, activePage: this.props.notes.activePage }))
	readSavedMessage = (props) => this.props.dispatch(readSavedMessage(props))
	clearNoteErrorMessage = () => this.props.dispatch(clearNoteErrorMessage())

	titleOptions = {
		edit: 'Edit Note',
		notes: 'My Notes',
		bookmarks: 'My Bookmarks',
		highlights: 'My Highlights',
	}

	// handleClickOutside = (event) => {
	// 	const bounds = this.ref.getBoundingClientRect();
	// 	const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
	// 	const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;
	//
	// 	if (this.ref && !(insideWidth && insideHeight)) {
	// 		this.props.toggleNotesModal();
	// 		document.removeEventListener('click', this.handleClickOutside);
	// 	}
	// }

	render() {
		const {
			activeChild,
			listData,
			isAddVerseExpanded,
			isVerseTextVisible,
			pageSize,
			totalPages,
			activePage,
			pageSelectorState,
			bookmarkList,
			userHighlights,
			pageSizeBookmark,
			totalPagesBookmark,
			activePageBookmark,
			pageSizeHighlight,
			totalPagesHighlight,
			activePageHighlight,
			savedTheNote,
			errorSavingNote,
			notesErrorMessage,
		} = this.props.notes;
		const {
			toggleNotesModal,
			selectedText,
			authenticationStatus,
			note,
			toggleProfile,
			notePassage,
			activeTextId,
			// highlights,
			vernacularNamesObject,
			// selectedListData,
			activeBookName,
		} = this.props;
		// console.log('notebook props', this.props);
		// console.log('data in notes', selectedListData);

		return (
			<GenericErrorBoundary affectedArea="Notes">
				<aside ref={this.setRef} className="notes">
					<header>
						<SvgWrapper className={'icon'} fill="#fff" svgid="arrow_right" onClick={() => { setActiveChild('notes'); toggleNotesModal(); }} />
						<SvgWrapper className={'icon'} svgid={'notebook'} onClick={() => { setActiveChild('notes'); toggleNotesModal(); }} />
						<h1 className="section-title">Notebook</h1>
					</header>
					{
						authenticationStatus ? (
							<React.Fragment>
								<div className="top-bar">
									{
										activeChild === 'notes' ? (
											<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('edit')} className={activeChild === 'notes' ? 'svg active' : 'svg'} height="26px" width="26px" svgid="edit_note" />
										) : null
									}
									{
										activeChild !== 'notes' ? (
											<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('notes')} className={activeChild === 'edit' ? 'svg active' : 'svg'} height="26px" width="26px" svgid="notes" />
										) : null
									}
									<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('highlights')} className={activeChild === 'highlights' ? 'svg active' : 'svg'} height="26px" width="26px" svgid="highlight" />
									<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('bookmarks')} className={activeChild === 'bookmarks' ? 'svg active' : 'svg'} height="26px" width="26px" svgid="bookmark" />
									<h1 className="text">{this.titleOptions[activeChild]}</h1>
								</div>
								{
									activeChild === 'edit' ? (
										<EditNote
											addNote={this.addNote}
											deleteNote={this.deleteNote}
											updateNote={this.updateNote}
											setActiveChild={this.setActiveChild}
											toggleVerseText={this.toggleVerseText}
											readSavedMessage={this.readSavedMessage}
											toggleAddVerseMenu={this.toggleAddVerseMenu}
											clearNoteErrorMessage={this.clearNoteErrorMessage}
											note={note}
											notePassage={notePassage}
											activeTextId={activeTextId}
											selectedText={selectedText}
											savedTheNote={savedTheNote}
											activeBookName={activeBookName}
											errorSavingNote={errorSavingNote}
											notesErrorMessage={notesErrorMessage}
											isVerseTextVisible={isVerseTextVisible}
											isAddVerseExpanded={isAddVerseExpanded}
											vernacularNamesObject={vernacularNamesObject}
										/>
									) : (
										<MyNotes
											getNotes={this.getNotes}
											deleteNote={this.deleteNote}
											setPageSize={this.setPageSize}
											getBookmarks={this.getBookmarks}
											getHighlights={this.getHighlights}
											setActiveNote={this.setActiveNote}
											setActivePage={this.setActivePage}
											setActiveChild={this.setActiveChild}
											updateHighlight={this.updateHighlight}
											deleteHighlights={this.deleteHighlights}
											togglePageSelector={this.togglePageSelector}
											pageSelectorState={pageSelectorState}
											vernacularNamesObject={vernacularNamesObject}
											listData={listData}
											highlights={userHighlights}
											sectionType={activeChild}
											pageSize={pageSize}
											totalPages={totalPages}
											bookmarkList={bookmarkList}
											activePage={activePage}
											pageSizeBookmark={pageSizeBookmark}
											totalPagesBookmark={totalPagesBookmark}
											activePageBookmark={activePageBookmark}
											pageSizeHighlight={pageSizeHighlight}
											totalPagesHighlight={totalPagesHighlight}
											activePageHighlight={activePageHighlight}
										/>
									)
								}
							</React.Fragment>
						) : (
							<div className="need-to-login">
								<p>Please <span className="login-text" role="button" tabIndex={0} onClick={() => { toggleNotesModal(); toggleProfile(); }}>sign in</span> to access your notebook.</p>
							</div>
						)
					}
				</aside>
			</GenericErrorBoundary>
		);
	}
}

Notes.propTypes = {
	dispatch: PropTypes.func.isRequired,
	toggleProfile: PropTypes.func,
	toggleNotesModal: PropTypes.func,
	authenticationStatus: PropTypes.bool,
	note: PropTypes.object,
	notes: PropTypes.object,
	vernacularNamesObject: PropTypes.object,
	// highlights: PropTypes.array,
	userId: PropTypes.string,
	openView: PropTypes.string,
	notePassage: PropTypes.string,
	selectedText: PropTypes.string,
	activeTextId: PropTypes.string,
	// selectedListData: PropTypes.array,
	activeBookName: PropTypes.string,
	activeBookId: PropTypes.string,
	activeChapter: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
	notes: makeSelectNotes(),
	selectedText: selectHighlightedText(),
	authenticationStatus: selectUserAuthenticationStatus(),
	userId: selectUserId(),
	note: selectActiveNote(),
	notePassage: selectNotePassage(),
	activeTextId: selectActiveTextId(),
	vernacularNamesObject: vernacularBookNameObject(),
	// highlights: selectHighlights(),
	// selectedListData: selectListData(),
	activeBookName: selectActiveBookName(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'notes', reducer });
const withSaga = injectSaga({ key: 'notes', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(Notes);
