/* BOILERPLATE */

import addInputFieldValidation, { removeInputFieldValidation } from './add-input-field-validation.js';

function resetEventListener() {
	setTimeout(() => { // SetTimeout() is needed to run after the value has resetted.
		for (const inputEl of this.elements) {
			inputEl.fieldValidation?.hideValidity();
			inputEl.fieldValidation?.checkValidity();
		}
	}, 0);
}

function submitEventListener(event) {
	if (!reportValidity(this)) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}
}

export default function addFormFieldValidation(formEl, callback) {
	formEl.fieldValidation = {
		hasNovalidate: formEl.hasAttribute('novalidate')
	};

	formEl.setAttribute('novalidate', '');

	formEl.addEventListener('reset', resetEventListener);
	formEl.addEventListener('submit', submitEventListener);

	for (const inputEl of formEl.elements) {
		if (inputEl instanceof HTMLFieldSetElement || inputEl.fieldValidation) {
			continue;
		}
		addInputFieldValidation(inputEl, callback);
	}

	callback?.(formEl);
}

export function removeFormFieldValidation(formEl, callback) {
	callback?.(formEl);

	for (const inputEl of formEl.elements) {
		if (inputEl instanceof HTMLFieldSetElement || inputEl.fieldValidation) {
			continue;
		}

		removeInputFieldValidation(inputEl, callback);
	}

	formEl.removeEventListener('reset', resetEventListener);
	formEl.removeEventListener('submit', submitEventListener);

	const { hasNovalidate } = formEl.fieldValidation;
	if (!hasNovalidate) {
		formEl.removeAttribute('novalidate');
	}

	delete formEl.fieldValidation;
}

export function reportValidity(formEl) {
	for (const inputEl of formEl.elements) {
		inputEl.fieldValidation?.showValidity();
	}

	return formEl.reportValidity();
}
