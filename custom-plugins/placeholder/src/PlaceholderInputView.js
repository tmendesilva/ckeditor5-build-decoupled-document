import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

import FocusCycler from "@ckeditor/ckeditor5-ui/src/focuscycler";
import InputTextView from "@ckeditor/ckeditor5-ui/src/inputtext/inputtextview";
import ListItemView from "@ckeditor/ckeditor5-ui/src/list/listitemview";
import ListView from "@ckeditor/ckeditor5-ui/src/list/listview";

/**
 * The link actions view class. This view displays the link preview, allows
 * unlinking or editing the link.
 *
 * @extends View
 */
export default class PlaceholderInputView extends ListView {

    /**
     * @inheritDoc
     */
    constructor(editor, data, placeholder) {

        super(editor.locale);

        this.placeholder = placeholder;

        // Load options
        this.options = this._createOption(editor, data, placeholder);

        /**
         * Tracks information about DOM focus in the actions.
         * @readonly
         * @member {FocusTracker}
         */
        this.focusTracker = new FocusTracker();

        /**
         * An instance of the {KeystrokeHandler}.
         * @readonly
         * @member {KeystrokeHandler}
         */
        this.keystrokes = new KeystrokeHandler();

        /**
         * A collection of views that can be focused in the view.
         * @readonly
         * @protected
         * @member {ViewCollection}
         */
        this._focusables = new ViewCollection();

        /**
         * Helps cycling over {@link #_focusables} in the view.
         * @readonly
         * @protected
         * @member {FocusCycler}
         */
        this.focusCycler = new FocusCycler({
            focusables: this._focusables,
            focusTracker: this.focusTracker,
            keystrokeHandler: this.keystrokes,
            actions: {
                focusPrevious: 'arrowup',
                focusNext: 'arrowdown'
            }
        });

        this.setTemplate({
            tag: 'ul',
            attributes: {
                class: 'ck-list placeholder-option-ul',
                // tabindex: '-1'
            },
            children: this.options
        });
    }

    /**
     * @inheritDoc
     */
    render() {
        super.render();

        this.options.forEach(v => {

            // Register the view as focusable.
            this._focusables.add(v);

            // Register the view in the focus tracker.
            this.focusTracker.add(v.element);
        });

        // Utilizado para esconder balloon quando ballon perde o focus
        this.focusTracker.on('change:isFocused', (evt, name, isFocused) => {
            if (!isFocused) {
                this.placeholder.closeBalloon();
            }
        });
    }

    focus(value) {
        const fC = this.focusCycler;
        fC.focusFirst();
    }

    _createOption(editor, data) {
        const target = data.target;
        const modelElement = editor.editing.mapper.toModelElement(target);
        const inputView = new InputTextView(editor.locale);
        inputView.set({
            placeholder: 'TEXTO',
            value: modelElement.getAttribute('isSolved') ? modelElement.getAttribute('value') : ''
        });
        inputView.on('input', ( eventInfo ) => {
            const value = eventInfo.source.element.value;
            editor.model.change(writer => {
                writer.setAttributes({
                    isSolved: value ? 1 : '',
                    value: value
                }, modelElement);
            });
        });

        const liView = new ListItemView(editor.locale);
        liView.children.add(inputView);

        return [liView];
    }
}
