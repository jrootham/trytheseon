/**
 * common.js
 *
 * Created by jrootham on 15/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {redraw} from "./index"

export const makeGoBack = store => {
    return () => {
        store.display.page = store.display.previous;
        redraw();
    }
}

export const show = name => {
    let popup = document.getElementById(name);
    popup.setAttribute("style", "display:block");
};

export const hide = name => {
    let popup = document.getElementById(name);
    popup.setAttribute("style", "display:none");
};

