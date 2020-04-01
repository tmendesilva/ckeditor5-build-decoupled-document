import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class CustomFontSizeUI extends Plugin {
	init() {
		this.editor.ui.componentFactory.add( 'fontSizeDropdown', () => {
			const editor = this.editor;

			const command = editor.commands.get( 'fontSize' );

			// Use original fontSize button - we only changes its behavior.
			const dropdownView = editor.ui.componentFactory.create( 'fontSize' );

			// Show label on dropdown's button.
			dropdownView.buttonView.set( 'withText', true );

			// Disable icon on the button.
			dropdownView.buttonView.set( 'icon', false );

			// To hide the icon uncomment below.
			// dropdownView.buttonView.set( 'icon', false );

			// Bind dropdown's button label to fontSize value.
			dropdownView.buttonView.bind( 'label' ).to( command, 'value', value => {
				// If no value is set on the command show 'Default' text.
				// Use t() method to make that string translatable.
				if(value){
					return value;
				} else {
					const defaultFontSize = editor.config.get('defaultFontSize');
					return defaultFontSize ? defaultFontSize : '12'; // The Default size is '12'
				}
			} );

			return dropdownView;
		} );
	}
}
