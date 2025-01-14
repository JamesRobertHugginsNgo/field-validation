import addFormFieldValidation from '../src/add-form-field-validation.js';
addFormFieldValidation(document.querySelector('form'), (el) => {
	switch (el.name) {
		case 'text-field':
			el.fieldValidation.validator = (inputEl) => {
				if (inputEl.value === '0') {
					inputEl.setCustomValidity('Value must not be 0');
					return;
				}
				if (inputEl.value === 'ABC') {
					inputEl.setCustomValidity('Value must not be ABC');
					return;
				}
			};
			break;
	}
});
