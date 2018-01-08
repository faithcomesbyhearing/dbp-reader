/**
*
* Text
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import ContextPortal from 'components/ContextPortal';
/* Disabling the jsx-a11y linting because we need to capture the selected text
	 and the most straight forward way of doing so is with the onMouseUp event */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
class Text extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		this.state = {
			currentSelection: '',
			contextMenuState: false,
			coords: {},
		};
	}

	setMainRef = (el) => {
		this.main = el;
	}

	handleRightClick = (e) => {
		// Can potentially use the below menu to activate the menu for note taking
		if (e.button === 2) {
			const x = e.clientX;
			const y = e.clientY;
			this.setState({
				coords: { x, y },
			});
			this.openContextMenu();
		}
		if (e.button === 0) {
			this.setState({
				currentSelection: window.getSelection().toString(),
			});
		}
		// Below code gets the highlighted text
		// window.getSelection().toString();
	}
	// Allows us to use the right mouse button to toggle menu's or perform different actions
	handleContext = (e) => e.preventDefault()

	openContextMenu = () => this.setState({ contextMenuState: true })

	closeContextMenu = () => this.setState({ contextMenuState: false })

	render() {
		const {
			text,
			nextChapter,
			prevChapter,
			activeBookName,
			activeChapter,
			toggleNotesModal,
			notesActive,
			setActiveNotesView,
			readersMode,
			oneVersePerLine,
		} = this.props;
		let textComponents;
		if (readersMode) {
			textComponents = text.map((verse) => (
				<span key={verse.verse_start}>{verse.verse_text}</span>
			));
		} else if (oneVersePerLine) {
			textComponents = text.map((verse) => (
				<span key={verse.verse_start}><br />{verse.verse_text}<br /></span>
			));
		} else {
			textComponents = text.map((verse) => (
				<span key={verse.verse_start}>&nbsp;<sup>{verse.verse_start}</sup>&nbsp;{verse.verse_text}</span>
			));
		}
		return (
			<div className="text-container">
				{
					activeBookName === 'Genesis' && activeChapter === 1 ? null : (
						<SvgWrapper onClick={prevChapter} className="prev-arrow-svg" svgid="prev-arrow" />
					)
				}
				<main ref={this.setMainRef} onClick={(e) => e.button === 0 && this.closeContextMenu()} onMouseUp={this.handleRightClick} className="chapter" onContextMenu={this.handleContext}>
					<h1 className="active-chapter-title">{activeChapter}</h1>
					{textComponents}
				</main>
				{
					activeBookName === 'Revelation' && activeChapter === 22 ? null : (
						<SvgWrapper onClick={nextChapter} className="next-arrow-svg" svgid="next-arrow" />
					)
				}
				{
					this.state.contextMenuState ? (
						<ContextPortal setActiveNotesView={setActiveNotesView} closeContextMenu={this.closeContextMenu} toggleNotesModal={toggleNotesModal} notesActive={notesActive} parentNode={this.main} coordinates={this.state.coords} />
					) : null
				}
			</div>
		);
	}
}

Text.propTypes = {
	text: PropTypes.array,
	nextChapter: PropTypes.func,
	prevChapter: PropTypes.func,
	toggleNotesModal: PropTypes.func,
	setActiveNotesView: PropTypes.func,
	activeBookName: PropTypes.string,
	activeChapter: PropTypes.number,
	notesActive: PropTypes.bool,
	readersMode: PropTypes.bool,
	oneVersePerLine: PropTypes.bool,
};

export default Text;
