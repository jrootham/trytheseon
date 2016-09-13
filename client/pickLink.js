/**
 * pickLink.js
 *
 * Created by jrootham on 02/08/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import {Constants} from "./data";
import ServerBase from "./serverBase";

export default class PickLink extends ServerBase {

    setPicture(store, picture) {
        store.picture = picture;

        store.display.page = Constants.page.LINK_PICTURE;
    }
}