/**
 * serverLayout.js
 *
 * Created by jrootham on 08/07/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {Constants, makeScenePicture} from "./data";
import ServerBase from "./serverBase";

export default class ServerLayout extends ServerBase {
    
    setPicture(store, picture) {
        const scenePicture = makeScenePicture(picture);
        if (store.scene) {
            store.scene.add(scenePicture);
        }
        else {
            const scene = new Scene("", Constants.MAX_WIDTH, Constants.MAX_HEIGHT, [scenePicture]);
            store.scene = scene;
        }

        store.display.which = store.scene.scenePictures.length - 1;
        store.display.page = Constants.page.LAYOUT;
    }
}