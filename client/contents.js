import React from "react";
import ReactDOM from "react-dom";
import RadioGroup from "react-radio";

import "./../trytheseon.css"

import {store, Constants} from "./data.js";
import {Edit} from "./edit.js";
import {setOverlay, paintAll} from "./paint.js";
import {PictureEditor} from "./picture.js";

const THREESIXTY = Math.PI / 180;

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
            <PictureEditor store = {this.props.store} />
        </div>
    }
});

export const show = name => {
    let popup = document.getElementById(name);
    popup.setAttribute("style", "display:block");
};

export const hide = name => {
    let popup = document.getElementById(name);
    popup.setAttribute("style", "display:none");
};

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

        this.props.store.data.pictures.forEach((element, index) => {
            which.push({value:index, label:element.name})
        });

        const makeChange = store => {
            return (value, event) => {
                store.display.which = parseInt(value);
                setOverlay(store);
                redraw();
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
                <div>Width {this.props.size.width}</div>
                <div>Height {this.props.size.height}</div>
            </div>
    }
});

const PictureData = React.createClass({
    plus: function() {
        let pictureList = this.props.store.data.pictures;
        let index = this.props.store.display.which;
        let picture = pictureList[index];
        let length = pictureList.length;
        if (length > 1 && picture.zIndex < length - 1) {
            let other = pictureList.find(element => {
                return element.zIndex === picture.zIndex + 1;
            });

            other.zIndex--;
            picture.zIndex++;
        }
        redraw();
    },

    minus: function() {
        let pictureList = this.props.store.data.pictures;
        let index = this.props.store.display.which;
        let picture = pictureList[index];
        let length = pictureList.length;
        if (length > 1 && picture.zIndex > 0) {
            let other = pictureList.find(element => {
                return element.zIndex === picture.zIndex - 1;
            });

            other.zIndex++;
            picture.zIndex--;
        }
        redraw();
    },

    render: function() {
        let index = this.props.store.display.which;
        let picture = this.props.store.data.pictures[index];

        return <div>
            <div>Name: {picture.name}</div>
            <div>X: {picture.translateX}</div>
            <div>Y: {picture.translateY}</div>
            <div>Scale: {picture.scale}</div>
            <div>Rotate: {Math.round(picture.rotate / THREESIXTY)}</div>
            <div>Z: {picture.zIndex}</div>
            <div>
                <button onClick={this.plus}>+</button>
                <button onClick={this.minus}>-</button>
            </div>
        </div>
    }
});

const Display = React.createClass({
    render: function() {
        let output = <div></div>

        switch (this.props.store.display.which) {
            case Constants.NONE:
                break;

            case Constants.SIZE:
                output = <div id="display">
                    <Size size = {this.props.store.data.size} />
                </div>
                break;

            default:
                if (this.props.store.display.which >= 0) {
                    output = <div id="display">
                        <PictureData store ={this.props.store} />
                    </div>
                }
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
            <Before store = {this.props.store} />
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

export const redraw = function() {
    ReactDOM.render(<Parent store={store}/>, document.getElementById('bigbox'));
    paintAll(store);
}

redraw();
