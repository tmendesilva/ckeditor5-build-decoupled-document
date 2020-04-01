import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class CustomTable extends Plugin {

	init() {

		const editor = this.editor;

		// The 'customClass' attribute will store custom classes from data in the model so schema definitions to allow this attribute.
		editor.model.schema.extend('table', {allowAttributes: ['customClass']});

		// Define upcast converters for <table> elements with "low" priority so they are run after default converters.
		editor.conversion.for('upcast').add(upcastCustomClasses('table'), {priority: 'low'});

		// Define downcast converters for  'table' model elements with "low" priority so they are run after default converters.
		editor.conversion.for('downcast').add(downcastCustomClasses('table', 'table'), {priority: 'low'});

	}
}

/**
 * Creates upcast converter that will pass all classes from view element to model element.
 *
 * @param {String} elementName
 * @returns {Function}
 */
function upcastCustomClasses(elementName) {
	return dispatcher => dispatcher.on(`element:${elementName}`, (evt, data, conversionApi) => {
		const viewItem = data.viewItem;
		const modelRange = data.modelRange;

		const modelElement = modelRange && modelRange.start.nodeAfter;

		if ( !modelElement ) {
			return;
		}

		conversionApi.writer.setAttribute('customClass', [...viewItem.getClassNames()], modelElement);
	});
}

/**
 * Creates downcast converter that add classes defined in `customClass` attribute to given view element.
 *
 * This converter expects that view element is nested in figure element.
 *
 * @param {String} modelElementName
 * @param {String} viewElementName
 * @returns {Function}
 */
function downcastCustomClasses(modelElementName, viewElementName) {
	return dispatcher => dispatcher.on(`insert:${modelElementName}`, (evt, data, conversionApi) => {
		const modelElement = data.item;

		const viewFigure = conversionApi.mapper.toViewElement(modelElement);
		const viewElement = findViewChild(viewFigure, viewElementName, conversionApi);

		if ( !viewElement ) {
			return;
		}

		conversionApi.writer.addClass(modelElement.getAttribute('customClass'), viewElement);
	});
}

/**
 * Helper method that search for given view element in all children of model element.
 *
 * @param {Item} viewElement
 * @param {String} viewElementName
 * @param {DowncastConversionApi} conversionApi
 * @return {Item}
 */
function findViewChild(viewElement, viewElementName, conversionApi) {
	const viewChildren = [...conversionApi.writer.createRangeIn(viewElement).getItems()];

	return viewChildren.find(item => item.is(viewElementName));
}
