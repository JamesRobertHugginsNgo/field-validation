/* BOILERPLATE */

function getValidationMessages(fieldsetEl) {
	const result = [];

	for (const inputEl of fieldsetEl.elements) {
		if (!inputEl.fieldValidation) {
			continue;
		}

		const { isValidating } = inputEl.fieldValidation;
		if (!isValidating) {
			checkValidity(inputEl);
		}

		result.push(inputEl.validationMessage);
	}

	return result.filter(function (value, index, array) {
		return value && array.indexOf(value) === index;
	});
}

function resetValidity(inputEl) {
	const { errorEl, fieldEl } = inputEl.fieldValidation;

	if (inputEl.validity.customError) {
		inputEl.setCustomValidity('');
	}

	if (errorEl && fieldEl instanceof HTMLFieldSetElement) {
		const validationMessages = getValidationMessages(fieldEl);
		if (validationMessages.length > 0) {
			errorEl.textContent = validationMessages.join(', ');
			return;
		}
	}

	fieldEl.classList.remove('field-error');
}

function checkValidity(inputEl) {
	inputEl.fieldValidation.isValidating = true;

	resetValidity(inputEl);

	const { validator } = inputEl.fieldValidation;
	if (validator) {
		validator(inputEl);
	}

	const result = inputEl.checkValidity();

	inputEl.fieldValidation.isValidating = false;

	return result;
}

function hideValidity(inputEl) {
	const { fieldEl } = inputEl.fieldValidation;
	fieldEl.classList.remove('show-field-error');
}

function showValidity(inputEl) {
	const { fieldEl } = inputEl.fieldValidation;
	fieldEl.classList.add('show-field-error');
}

function inputEventListener() {
	checkValidity(this);
	showValidity(this);
}

function invalidEventListener() {
	const { errorEl, fieldEl } = this.fieldValidation;

	if (errorEl) {
		if (fieldEl instanceof HTMLFieldSetElement) {
			errorEl.textContent = getValidationMessages(fieldEl).join(', ');
		} else {
			errorEl.textContent = this.validationMessage;
		}
	}

	fieldEl.classList.add('field-error');
}

export default function addInputFieldValidation(inputEl, callback) {
	const fieldEl = inputEl.closest('.field');
	if (!fieldEl) {
		return;
	}

	inputEl.fieldValidation = {
		errorEl: fieldEl.querySelector('.field-error-text'),
		fieldEl,
		isValidating: false,
		validator: null,

		checkValidity() {
			return checkValidity(inputEl);
		},
		hideValidity() {
			hideValidity(inputEl);
		},
		showValidity() {
			showValidity(inputEl)
		}
	};

	inputEl.addEventListener('input', inputEventListener);
	inputEl.addEventListener('invalid', invalidEventListener);

	checkValidity(inputEl);
	callback?.(inputEl);
}

export function removeInputFieldValidation(inputEl, callback) {
	callback?.(inputEl);

	resetValidity(inputEl);

	inputEl.removeEventListener('input', inputEventListener);
	inputEl.removeEventListener('invalid', invalidEventListener);

	delete inputEl.fieldValidation;
}
