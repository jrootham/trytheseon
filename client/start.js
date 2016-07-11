/**
 * start.js
 *
 * Created by jrootham on 13/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import React from "react";

export default class Start extends React.Component {
    render() {
        const store = this.props.store;
        let message = "";
        if (store.display.error) {
            message = store.display.error;
        }

        return <div>
            <div className="error">{message}</div>
            <div>Introductory text.</div>
            </div>
    }
}