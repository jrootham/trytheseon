/**
 * signon.js
 *
 * Created by jrootham on 14/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";

import {redraw} from "./index";

export default class Signon extends React.Component {
    render() {
        return <div>
            <div>Signon not implemented</div>
            <div><button onClick={makeGoBack(this.props.store)}>Cancel</button></div>
        </div>
    }
}