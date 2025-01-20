/* BOILERPLATE: https://github.com/JamesRobertHugginsNgo/make-form/blob/d66225c92b53ffd1dd2999c27d75b17bd13c4aaf/src/add-input-field-validation.js */
/* BOILERPLATE: https://raw.githubusercontent.com/JamesRobertHugginsNgo/make-form/d66225c92b53ffd1dd2999c27d75b17bd13c4aaf/src/add-input-field-validation.js?token=GHSAT0AAAAAAC4FUXGROIIDWPYY3IRYJTVSZ4OUTRA */

function getValidationMessages(inputEl) {
	const { fieldEl } = inputEl.fieldValidation;

	const result = [];

	if (fieldEl.dataset.isGettingMessage) {
		return result;
	}

	fieldEl.dataset.isGettingMessage = 'true';

	for (const fieldInputEl of fieldEl.elements) {
		if (!fieldInputEl.fieldValidation) {
			continue;
		}

		if (!fieldInputEl.dataset.isInvalid) {
			checkValidity(fieldInputEl);
		}

		result.push(fieldInputEl.validationMessage);
	}

	delete fieldEl.dataset.isGettingMessage;

	return result.filter((value, index, array) => {
		return value && array.indexOf(value) === index;
	});
}

function resetValidity(inputEl) {
	const { errorEl, fieldEl } = inputEl.fieldValidation;

	if (inputEl.validity.customError) {
		inputEl.setCustomValidity('');
	}

	if (errorEl && fieldEl instanceof HTMLFieldSetElement) {
		const svgEl = errorEl.querySelector('svg');
		if (!svgEl) {
			errorEl.textContent = '';
		} else {
			errorEl.replaceChildren(svgEl);
		}
	}

	fieldEl.classList.remove('field-error');
}

function checkValidity(inputEl) {
	resetValidity(inputEl);

	const { validator } = inputEl.fieldValidation;
	if (validator) {
		validator(inputEl);
	}

	const result = inputEl.checkValidity();

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
		let errorMessage;
		if (fieldEl instanceof HTMLFieldSetElement) {
			this.dataset.isInvalid = 'true';
			errorMessage = getValidationMessages(this).join(', ');
			delete this.dataset.isInvalid;
		} else {
			errorMessage = this.validationMessage;
		}
		if (!errorMessage) {
			return;
		}

		const svgEl = errorEl.querySelector('svg');
		if (!svgEl) {
			errorEl.textContent = errorMessage;
		} else {
			errorEl.replaceChildren(svgEl, ' ');
			const messageEl = errorEl.appendChild(document.createElement('span'));
			messageEl.textContent = errorMessage;
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

	callback?.(inputEl);

	checkValidity(inputEl);
}

export function removeInputFieldValidation(inputEl, callback) {
	callback?.(inputEl);

	resetValidity(inputEl);

	inputEl.removeEventListener('input', inputEventListener);
	inputEl.removeEventListener('invalid', invalidEventListener);

	delete inputEl.fieldValidation;
}
