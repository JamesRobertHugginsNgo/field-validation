import addFormFieldValidation, { reportValidity } from '../src/add-form-field-validation.js';

const formEl = document.querySelector('form');

addFormFieldValidation(formEl, (el) => {
	switch (el.name) {
		case 'checkbox-field[]':
			el.fieldValidation.validator = (inputEl) => {
				const { fieldEl } = inputEl.fieldValidation;
				const length = [...fieldEl.elements].filter(function (el) {
					return el.checked;
				}).length;
				if (length === 0) {
					inputEl.setCustomValidity('Select at least one of these options');
				}
			};
			break;

		case 'first-name-field':
			el.fieldValidation.validator = (inputEl) => {
				if (inputEl.validity.valueMissing) {
					inputEl.setCustomValidity('First Name is missing');
				}
			};
			break;

		case 'last-name-field':
			el.fieldValidation.validator = (inputEl) => {
				if (inputEl.validity.valueMissing) {
					inputEl.setCustomValidity('Last Name is missing');
				}
			};
			break;
	}
});

document.querySelector('input[type="button"]').addEventListener('click', (event) => {
	if (!reportValidity(formEl)) {
		return;
	}

	alert('SUBMIT')
});
