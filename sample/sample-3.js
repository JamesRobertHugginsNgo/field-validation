import addFormFieldValidation, { reportValidity } from '../src/add-form-field-validation.js';

const formEl = document.querySelector('form');
const toggleTextFieldEl = document.getElementById('toggle-text-field');
const toggleButtonEl = document.querySelector('button');
const toggleButtonWrapperEl = toggleButtonEl.closest('p');

addFormFieldValidation(formEl);

document.getElementById('toggle-field-1').addEventListener('input', () => {
	toggleTextFieldEl.removeAttribute('disabled');
	const { fieldEl } = toggleTextFieldEl.fieldValidation;
	fieldEl.style.removeProperty('display');

	toggleButtonWrapperEl.style.removeProperty('display');
});

document.getElementById('toggle-field-2').addEventListener('input', () => {
	toggleTextFieldEl.setAttribute('disabled', '');
	const { fieldEl } = toggleTextFieldEl.fieldValidation;
	fieldEl.style.setProperty('display', 'none');

	toggleButtonWrapperEl.style.setProperty('display', 'none');
});

toggleButtonEl.addEventListener('click', (event) => {
	if (!toggleTextFieldEl.value) {
		toggleTextFieldEl.value = '123';
	} else {
		toggleTextFieldEl.value = '';
	}
	toggleTextFieldEl.dispatchEvent(new Event('input'));
	toggleTextFieldEl.focus();
});

formEl.addEventListener('submit', (event) => {
	event.preventDefault();
	alert('SUBMITTED');
});
