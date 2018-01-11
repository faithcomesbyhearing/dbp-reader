import { takeLatest, call, put } from 'redux-saga/effects';
import languageList from 'utils/languagesWithResources';
import request from 'utils/request';
import { GET_COUNTRIES, GET_DPB_TEXTS, GET_LANGUAGES } from './constants';
import { loadTexts, loadCountries, setLanguages } from './actions';

export function* getCountries() {
	const requestUrl = `https://api.bible.build/countries?key=${process.env.DBP_API_KEY}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);
		const countries = response.data.reduce((acc, country) => {
			const tempObj = acc;
			if (typeof country.name !== 'string') {
				tempObj[country.name.name] = { ...country, name: country.name.name };
			} else if (country.name === '') {
				return acc;
			} else {
				tempObj[country.name] = country;
			}
			return tempObj;
		}, {});

		yield put(loadCountries({ countries }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* getTexts() {
	// need to configure the correct request url as this one is not getting a response
	const requestUrl = `https://api.bible.build/bibles?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	try {
		const response = yield call(request, requestUrl);
		const texts = response.data.filter((text) => !Array.isArray(text.filesets) && Object.keys(text.filesets).length);

		yield put(loadTexts({ texts }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* getLanguages() {
	const requestUrl = `https://api.bible.build/languages?key=${process.env.DBP_API_KEY}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);
		const languages = response.data.filter((language) => languageList[language.iso_code.toUpperCase()]);

		yield put(setLanguages({ languages }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(GET_DPB_TEXTS, getTexts);
	yield takeLatest(GET_LANGUAGES, getLanguages);
	yield takeLatest(GET_COUNTRIES, getCountries);
}
