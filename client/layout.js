/**
 * layout.js
 *
 * Created by jrootham on 09/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";
import RadioGroup from "react-radio";

import "./../trytheseon.css"

import {redraw} from "./index"
import {store, Constants, Scene} from "./data";
import Edit from "./edit";
import {setOverlay, paintAll} from "./paint";
import {PictureEditor} from "./picture";
import {intParse, floatParse} from "./common";

const THREESIXTY = Math.PI / 180;

class Select extends React.Component {
    render() {
        const which = [
            {
                value: Constants.layout.NOTHING,
                label: "None",
                style: {display:"block"}
            },
            {
                value: Constants.layout.SIZE,
                label: "Size",
                style: {display:"block"}
            }
        ];

        this.props.store.scene.placements.forEach((element, index) => {
            which.push({
                value:index,
                label:element.name,
                style: {display:"block"}
            });
        });

        const makeChange = store => {
            return (value, event) => {
                this.props.store.display.which = parseInt(value);
                redraw();
            }
        }

        return <div>
            <RadioGroup
                name="which"
                defaultValue={this.props.store.display.which}
                items={which}
                onChange={makeChange(this.props.store)}
            />
        </div>
    }
}

class Size extends React.Component {
    render() {
        return <div>
            <div>Width {this.props.store.scene.width}</div>
            <div>Height {this.props.store.scene.height}</div>
        </div>
    }
}

class InputTranslateX extends React.Component {
    handleChange(event) {
        this.props.placement.translateX = intParse(event.target.value, 0);
        redraw();
    }

    render() {
        return (
            <input
                type="text"
                className="input_box"
                value={this.props.placement.translateX}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
}

class InputTranslateY extends React.Component {
    handleChange(event) {
        this.props.placement.translateY = intParse(event.target.value, 0);
        redraw();
    }

    render() {
        return (
            <input
                type="text"
                className="input_box"
                value={this.props.placement.translateY}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
}

class InputScale extends React.Component {
    handleChange(event) {
        this.props.placement.scale = floatParse(event.target.value, 0);
        redraw();
    }

    render() {
        return (
            <input
                type="text"
                className="input_box"
                value={Math.round((100 * this.props.placement.scale)) / 100}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
}

class InputRotate extends React.Component {
    handleChange(event) {
        this.props.placement.rotate = intParse(event.target.value, 0) * THREESIXTY;
        redraw();
    }

    render() {
        return (
            <input
                type="text"
                className="input_box"
                value={Math.round(this.props.placement.rotate / THREESIXTY)}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
}

class PictureData extends React.Component {
    plus() {
        let placementList = this.props.store.scene.placements;
        let index = this.props.store.display.which;
        let placement = placementList[index];
        let length = placementList.length;
        if (length > 1 && placement.zIndex < length - 1) {
            let other = placementList.find(element => {
                return element.zIndex === placement.zIndex + 1;
            });

            other.zIndex--;
            placement.zIndex++;
        }
        redraw();
    }

    minus() {
        let placementList = this.props.store.scene.placements;
        let index = this.props.store.display.which;
        let placement = placementList[index];
        let length = placementList.length;
        if (length > 1 && placement.zIndex > 0) {
            let other = placementList.find(element => {
                return element.zIndex === placement.zIndex - 1;
            });

            other.zIndex++;
            placement.zIndex--;
        }
        redraw();
    }

    edit() {
        const display = this.props.store.display;
        display.page = Constants.page.EDIT_PICTURE;

        const picture = display.picture;
        picture.zoom = 1;
        picture.colourTransparent = false;
        picture.layout = Constants.picture.NOTHING;

        redraw();
    }

    render() {
        let index = this.props.store.display.which;
        let placement = this.props.store.scene.placements[index];

        return <div>
            <div>Name: {placement.name}</div>
            <div>X:<InputTranslateX placement={placement}/></div>
            <div>Y:<InputTranslateY placement={placement}/></div>
            <div>Scale:<InputScale placement={placement}/></div>
            <div>Rotate:<InputRotate placement={placement}/></div>
            <div>Z: {placement.zIndex}</div>
            <div>
                <button onClick={this.plus.bind(this)}>+</button>
                <button onClick={this.minus.bind(this)}>-</button>
            </div>
            <div>
                <button onClick={this.edit.bind(this)}>Edit</button>
            </div>
        </div>
    }
};

class Display extends React.Component {
    render() {
        let output = <div></div>

        switch (this.props.store.display.which) {
            case Constants.layout.NOTHING:
                output = <div></div>
                break;

            case Constants.layout.SIZE:
                output = <div className="control_container" id="display">
                    <Size store = {this.props.store} />
                </div>
                break;

            default:
                if (this.props.store.display.which >= 0) {
                    output = <div className="control_container" id="display">
                        <PictureData store ={this.props.store} />
                    </div>
                }
        }

        return output;
    }
}

class After extends React.Component{
    render() {
        const style = {
            display:        "inline-block",
            verticalAlign:  "top"
        };

        return <div className="control_container" style={style}>
            <Select store = {this.props.store}/>
            <Display store = {this.props.store} />
        </div>
    }
}

const setup = store => {
    if (!store.scene) {
        store.scene = new Scene(Constants.MAX_WIDTH, Constants.MAX_HEIGHT, []);
    }
};

export default class Layout extends React.Component{
    componentWillMount() {
        setup(this.props.store);
    }

    componentWillUpdate() {
        setup(this.props.store);
    }

    componentDidMount() {
        paintAll(this.props.store);
    }

    componentDidUpdate() {
        paintAll(this.props.store);
    }
    
    render() {
        return <div id="container">
            <Edit store = {this.props.store} />
            <After store = {this.props.store} />
        </div>
    }
};

