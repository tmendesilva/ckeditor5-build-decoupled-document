import Command from '@ckeditor/ckeditor5-core/src/command';
import {addCustomEvents} from "./PlaceholderUtils";

export default class PlaceholderCommand extends Command {

	execute(item) {

		const editor = this.editor;
		editor.model.change(writer => {

			const placeholder = writer.createElement('placeholder', {
				name: item.name,
				attr: item.attr ? item.attr : '',
				value: item.is_solved ? item.value : '',
				isFixed: item.is_fixed ? 1 : '',
				isSolved: item.is_solved ? 1 : '',
				options: item.options ? JSON.stringify(item.options) : ''
			});

			// ... and insert it into the document.
			editor.model.insertContent(placeholder);

			// Put the selection after inserted element.
			writer.setSelection(placeholder, 'after');
		});
		addCustomEvents(editor);
	}

	refresh() {
		const editor = this.editor;
		const model = editor.model;
		const selection = model.document.selection;
		addCustomEvents(editor);
		this.isEnabled = model.schema.checkChild(selection.focus.parent, 'placeholder');
	}
}
