import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

import {IsJsonString, nextPlaceholder} from "./PlaceholderUtils";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import ListItemView from "@ckeditor/ckeditor5-ui/src/list/listitemview";
import ListView from "@ckeditor/ckeditor5-ui/src/list/listview";

/**
 * The link actions view class. This view displays the link preview, allows
 * unlinking or editing the link.
 *
 * @extends View
 */
export default class PlaceholderOptionsView extends ListView {

    /**
     * @inheritDoc
     */
    constructor(editor, data, placeholder) {
        super(editor.locale);

        // Load options
        this.options = this._createOptions(editor, data, placeholder);

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
    }

    /**
     * Focuses the fist {@link #_focusables} in the actions.
     */
    focus(value) {
        const fC = this.focusCycler;
        fC.focusNext();
        if(value){
            const fT = this.focusTracker;
            const optionEl = fT.focusedElement.querySelector('.ck-button__label');
            if(optionEl.innerText !== value){
                this.focus(value);
            }
        }
    }

    _createOptions(editor, data, placeholder) {
        const element = data.domTarget;
        const target = data.target;
        let liOptions = [];
        if (IsJsonString(element.dataset.options)) {
            JSON.parse(element.dataset.options).forEach((option) => {

                const btnView = new ButtonView(editor.locale);
                btnView.set({
                    label: option,
                    withText: true,
                    class: 'placeholder-option-btn',
                    tooltip: false
                });
                btnView.on('execute', () => {
                    const modelElement = editor.editing.mapper.toModelElement(target);
                    editor.model.change(writer => {
                        writer.setAttributes({
                            isSolved: 1,
                            value: option
                        }, modelElement);
                        editor.editing.view.focus();

                        // Encontra proxima variavel
                        setTimeout(function () {
                            if (!nextPlaceholder(editor)) {
                                placeholder.closeBalloon();
                            }
                        }, 100);
                    });
                });

                const liView = new ListItemView(editor.locale);
                liView.children.add(btnView);
                liOptions.push(liView);
            });
        }
        return liOptions;
    }
}
