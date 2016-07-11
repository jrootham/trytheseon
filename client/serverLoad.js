/**
 * serverLoad.js
 *
 * Created by jrootham on 05/07/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {Constants} from "./data";

import ServerBase from "./serverBase";

export default class ServerLoad extends ServerBase {

    setPicture(store, picture) {
        store.picture = picture;

        store.display.page = Constants.page.EDIT_PICTURE;
        store.display.picture.layout = Constants.picture.NOTHING;
    }
}