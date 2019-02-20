import React from 'react';
import renderer from 'react-test-renderer';
import FadeTransition from '..';

const children = (
	<div id="transition-child-id">
		<h1>Child of the transition</h1>
		<p>Paragraph child of the transition</p>
	</div>
);

describe('<FadeTransition /> component', () => {
	it('should match snapshot with classNames', () => {
		const tree = renderer
			.create(
				<FadeTransition children={children} classNames={'slide-from-right'} />,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot without classNames', () => {
		const tree = renderer
			.create(<FadeTransition children={children} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
