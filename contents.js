import React from "react";
import ReactDOM from "react-dom";
import RadioGroup from "react-radio";

import {store, Constants} from "./data.js";
import {Edit} from "./edit.js";

const Title = React.createClass({
    render: function()  {
        return <div id="title">
            <h1>Try These On</h1>
        </div>
    }
});

const Before = React.createClass({
    render: function() {
        return <div id="before" >
            <Picture />
        </div>
    }
});

const Picture = React.createClass({
    render: function()  {
        return <div id="picture">
            <div>
                Picture
            </div>
            <div>
                <button>Load from local</button>
            </div>
            <div>
                <button>Load from server</button>
            </div>
            <div>
                <button>Save to server</button>
            </div>
        </div>

    }
});

const Select = React.createClass({
    render: function() {
        var which = [
            {
                value: Constants.NONE,
                label: "None\n"
            },
            {
                value: Constants.SIZE,
                label: "Size\n"
            }
        ];

        const makeChange = store => {
            return (value, event) => {
                store.display.which = parseInt(value);
                redraw(store);
            }
        }

        return <div>
            <RadioGroup
                name="which"
                defaultValue={Constants.NONE}
                items={which}
                onChange={makeChange(this.props.store)}
                />
        </div>
    }
});

const Size = React.createClass({
    render: function() {
        return <div>
                <div>Ratio {this.props.size.ratio}</div>
                <div>Scale {this.props.size.scale}</div>
                <div>Width {this.props.size.width}</div>
                <div>Height {this.props.size.height}</div>
            </div>
    }
});

const Display = React.createClass({
    render: function() {
        let output = <div></div>

        switch (this.props.store.display.which) {
            case Constants.SIZE:
                output = <div id="display">
                    <Size size = {this.props.store.data.size} />
                </div>
        }

        return output;
    }
});

const After = React.createClass({
    render: function() {
        return <div id="after">
            <Select store = {this.props.store}/>
            <Display store = {this.props.store} />
        </div>
    }
});

const Container = React.createClass({
    render: function() {
        return <div id="container">
            <Before />
            <Edit store = {this.props.store} />
            <After store = {this.props.store} />
        </div>
    }
});

const Parent = React.createClass({
    render: function() {

        return <div id="parent">
            <Title />
            <Container store={this.props.store}/>
        </div>
    }
});

const redraw = function() {
    console.log(store.display);
    ReactDOM.render(<Parent store={store}/>, document.getElementById('bigbox'));
}

redraw();
