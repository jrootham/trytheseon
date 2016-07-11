/**
 * localLoad.js
 *
 * Created by jrootham on 15/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import LoadBase from "./loadBase";
import {Constants, Picture} from "./data";
import {show, hide, makeGoBack} from "./common";
import {redraw} from "./index";

export default class LocalLoad extends LoadBase {
    constructor() {
        super();
        this.insertImage= this.insertImage.bind(this);
    }

    insertImage(image) {
        const store = this.props.store;
        
        store.picture = new Picture(image);
        store.picture.name = `Picture`;

        store.display.picture.layout = Constants.picture.NOTHING;

        store.display.page = Constants.page.EDIT_PICTURE;
        store.display.previous = store.display.page;
        redraw();
    }
}

