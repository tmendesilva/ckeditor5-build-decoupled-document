import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import PlaceholderEditing from "./PlaceholderEditing";
import PlaceholderUI from "./PlaceholderUI";

export default class Placeholder extends Plugin {
    static get requires() {
        return [ PlaceholderEditing, PlaceholderUI ];
    }
}
