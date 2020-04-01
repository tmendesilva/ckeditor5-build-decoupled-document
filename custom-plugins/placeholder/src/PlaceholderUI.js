import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {addListToDropdown, createDropdown} from "@ckeditor/ckeditor5-ui/src/dropdown/utils";
import Collection from "@ckeditor/ckeditor5-utils/src/collection";
import Model from '@ckeditor/ckeditor5-ui/src/model';
import placeholderIcon from "../icon/placeholder.svg";
import listIcon from "../icon/list.svg";
import fixedIcon from '../icon/fixed.svg';
import keyboardIcon from '../icon/keyboard.svg';
import '../css/placeholder.css';

export default class PlaceholderUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        // The "placeholder" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add('placeholder', locale => {

            const dropdownView = createDropdown(locale);

            const variables = editor.config.get('variables');
            if (variables) {
                dropdownView.buttonView.set({
                    icon: placeholderIcon,
                    label: t('Variaveis')
                });

                // Drop menu para esquerda
                dropdownView.panelPosition = 'sw';
                dropdownView.class = 'placeholder-dropdown';

                // Utilizado para desabilitar widget no modo readOnly
                const command = editor.commands.get('placeholder');
                dropdownView.bind('isEnabled').to(command);

                // Populate the list in the dropdown with items.
                addListToDropdown(dropdownView, getDropdownItemsDefinitions(variables));

                // Execute the command when the dropdown item is clicked (executed).
                this.listenTo(dropdownView, 'execute', evt => {
                    editor.execute('placeholder', evt.source.commandParam);
                    editor.editing.view.focus();
                });
            }
            return dropdownView;
        });
    }
}

/**
 *
 * @param variables
 * @returns {Collection}
 */
function getDropdownItemsDefinitions(variables) {
    const items = new Collection();
    items.add({
        type: 'button',
        model: new Model({
            icon: keyboardIcon,
            withText: true,
            label: 'VARIÁVEL LIVRE',
            attr: 'empty',
            commandParam: {
                name: 'VARIÁVEL LIVRE',
                attr: 'empty',
                is_fixed: false,
                is_solved: false,
                value: null,
                options: null
            }
        }),
    });
    variables.forEach((variable) => {
        items.add({
            type: 'button',
            model: new Model({
                icon: (variable.is_fixed ? fixedIcon : listIcon),
                withText: true,
                label: variable.name,
                attr: variable.attribute,
                commandParam: variable
            }),
        });
    });
    return items;
}
