/**
 * edit.js
 *
 * Created by jrootham on 27/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";

export const Edit = React.createClass({
    render: function() {
        let width = this.props.store.data.size.width;
        let height = this.props.store.data.size.height;
        return <div id="edit">
            <canvas id="canvas" width={width} height={height}>
                Canvas not supported
            </canvas>
        </div>
    }
});

