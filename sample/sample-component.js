/* BOILERPLATE: https://github.com/JamesRobertHugginsNgo/web-component/blob/main/src/form-component.js */
/* BOILERPLATE: https://raw.githubusercontent.com/JamesRobertHugginsNgo/web-component/refs/heads/main/src/form-component.js */

import addInputFieldValidation from '../src/add-input-field-validation.js';

const templateEl = document.createElement('template');
templateEl.innerHTML = `
	<style>
		@import url(${import.meta.resolve('./field.css')});
		@import url(${import.meta.resolve('./field-input.css')});

		:host {
			display: block;
			margin-bottom: 1rem;
			margin-top: 1rem;
		}
	</style>

	<div class="field">
		<label for="text-field" class="field-label">
			<span>(Optional)</span>
		</label>
		<div class="field-help-text" style="display: none"></div>
		<input name="text-field" type="text" class="field-input" id="text-field">
		<div class="field-help-text" style="display: none"></div>
		<div class="field-error-text"></div>
	</div>
`;

class SampleComponent extends HTMLElement {

	// STATIC PROPERTY(IES)

	static formAssociated = true;
	static observedAttributes = [
		'label',
		'posthelptext',
		'prehelptext',
		'required',
		'value'
	];

	// STATIC METHOD(S)

	// PRIVATE PROPERTY(IES)

	#formEl;
	#inputEl;
	#internals;
	#label;
	#labelEl;
	#optionalEl;
	#postHelpTextEl;
	#preHelpTextEl;
	#submitListener;

	// PRIVATE METHOD(S)

	#setFormValue() {
		this.#internals.setFormValue(this.#inputEl.value);
		this.#setValidity();
	}

	#setLabelVisibility() {
		if (!this.#label && this.#inputEl.hasAttribute('required')) {
			this.#labelEl.style.setProperty('display', 'none');
		} else {
			this.#labelEl.style.removeProperty('display');
		}
	}

	#setValidity() {
		this.#internals.setValidity(
			this.#inputEl.validity,
			this.#inputEl.validationMessage,
			this.#inputEl
		);
	}

	// PUBLIC PROPERTY(IES)

	get label() {
		return this.#label;
	}
	set label(newValue) {
		this.#label = newValue;
		if (!this.#label) {
			this.#labelEl.replaceChildren(this.#optionalEl);
		} else {
			this.#labelEl.replaceChildren(this.#label, ' ', this.#optionalEl);
		}
		this.#setLabelVisibility();
	}

	get name() {
		return this.getAttribute('name');
	}

	get postHelpText() {
		return this.#postHelpTextEl.textContent;
	}
	set postHelpText(newValue) {
		if (!newValue) {
			this.#postHelpTextEl.textContent = '';
			this.#postHelpTextEl.style.setProperty('display', 'none');
		} else {
			this.#postHelpTextEl.textContent = newValue;
			this.#postHelpTextEl.style.removeProperty('display');
		}
	}

	get preHelpText() {
		return this.#preHelpTextEl.textContent;
	}
	set preHelpText(newValue) {
		if (!newValue) {
			this.#preHelpTextEl.textContent = '';
			this.#preHelpTextEl.style.setProperty('display', 'none');
		} else {
			this.#preHelpTextEl.textContent = newValue;
			this.#preHelpTextEl.style.removeProperty('display');
		}
	}

	get required() {
		return this.#inputEl.hasAttribute('required');
	}
	set required(newValue) {
		if (!newValue) {
			this.#inputEl.removeAttribute('required');
			this.#optionalEl.style.removeProperty('display');
		} else {
			this.#inputEl.setAttribute('required', '');
			this.#optionalEl.style.setProperty('display', 'none');
		}
		this.#setLabelVisibility();
		this.#inputEl.fieldValidation.checkValidity();
		this.#setValidity();
	}

	get validity() {
		return this.#internals.validity;
	}

	get validationMessage() {
		return this.#internals.validationMessage;
	}

	get value() {
		return this.#inputEl.value;
	}
	set value(newValue) {
		this.#inputEl.value = newValue;
		this.#inputEl.fieldValidation.checkValidity();
		this.#setFormValue();
	}

	// PUBLIC METHOD(S)

	checkValidity() {
		return this.#internals.checkValidity();
	}

	reportValidity() {
		return this.#internals.reportValidity();
	}

	// LIFE CYCLE

	constructor() {
		super();

		this.attachShadow({
			mode: 'open',
			delegatesFocus: true
		});
		this.shadowRoot.appendChild(templateEl.content.cloneNode(true));

		this.#internals = this.attachInternals();

		this.#labelEl = this.shadowRoot.querySelector('label');
		this.#optionalEl = this.#labelEl.querySelector('span');

		const [preHelpTextEl, postHelpTextEl] = this.shadowRoot.querySelectorAll('.field-help-text');
		this.#postHelpTextEl = postHelpTextEl;
		this.#preHelpTextEl = preHelpTextEl;

		this.#inputEl = this.shadowRoot.querySelector('input');
		addInputFieldValidation(this.#inputEl);
		this.#setValidity();
		this.#inputEl.addEventListener('input', () => {
			this.#setFormValue();
		});
	}

	connectedCallback() { }

	disconnectedCallback() { }

	adoptedCallback() { }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'label':
				this.label = newValue;
				break;
			case 'posthelptext':
				this.postHelpText = newValue;
				break;
			case 'prehelptext':
				this.preHelpText = newValue;
				break;
			case 'required':
				this.required = newValue !== null && newValue.toLowerCase() !== 'false';
				break;
			case 'value':
				this.value = newValue;
				break;
		}
	}

	formAssociatedCallback(formEl) {
		if (this.#formEl) {
			this.#formEl.removeEventListener('submit', this.#submitListener);
		}
		this.#formEl = formEl;
		if (this.#formEl) {
			this.#submitListener = () => {
				this.#inputEl.fieldValidation.showValidity();
			};
			this.#formEl.addEventListener('submit', this.#submitListener);
		} else {
			this.#submitListener = null;
		}
	}

	formResetCallback() {
		const value = this.getAttribute('value');
		if (value == null) {
			this.value = '';
		} else {
			this.value = value;
		}
		this.#inputEl.fieldValidation.hideValidity();
	}

	formDisabledCallback(isDisabled) {
		if (isDisabled) {
			this.#inputEl.setAttribute('disabled', '');
			this.#inputEl.fieldValidation.hideValidity();
		} else {
			this.#inputEl.removeAttribute('disabled');
		}
		this.#inputEl.fieldValidation.checkValidity();
		this.#setValidity();
	}

	formStateRestoreCallback(state, reason) { }
}

customElements.define('sample-component', SampleComponent);
