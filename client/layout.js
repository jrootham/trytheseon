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
import persistence from "./persistence";

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

        this.props.store.scene.scenePictures.forEach((element, index) => {
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
        this.props.scenePicture.translateX = intParse(event.target.value, 0);
        redraw();
    }

    render() {
        return (
            <input
                type="text"
                className="input_box"
                value={this.props.scenePicture.translateX}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
}

class InputTranslateY extends React.Component {
    handleChange(event) {
        this.props.scenePicture.translateY = intParse(event.target.value, 0);
        redraw();
    }

    render() {
        return (
            <input
                type="text"
                className="input_box"
                value={this.props.scenePicture.translateY}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
}

class InputScale extends React.Component {
    handleChange(event) {
        this.props.scenePicture.scale = floatParse(event.target.value, 0);
        redraw();
    }

    render() {
        return (
            <input
                type="text"
                className="input_box"
                value={Math.round((100 * this.props.scenePicture.scale)) / 100}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
}

class InputRotate extends React.Component {
    handleChange(event) {
        this.props.scenePicture.rotate = intParse(event.target.value, 0) * THREESIXTY;
        redraw();
    }

    render() {
        return (
            <input
                type="text"
                className="input_box"
                value={Math.round(this.props.scenePicture.rotate / THREESIXTY)}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
}

class PictureData extends React.Component {
    plus() {
        let scenePictureList = this.props.store.scene.scenePictures;
        let index = this.props.store.display.which;
        let scenePicture = scenePictureList[index];
        let length = scenePictureList.length;
        if (length > 1 && scenePicture.zIndex < length - 1) {
            let other = scenePictureList.find(element => {
                return element.zIndex === scenePicture.zIndex + 1;
            });

            other.zIndex--;
            scenePicture.zIndex++;
        }
        redraw();
    }

    minus() {
        let scenePictureList = this.props.store.scene.scenePictures;
        let index = this.props.store.display.which;
        let scenePicture = scenePictureList[index];
        let length = scenePictureList.length;
        if (length > 1 && scenePicture.zIndex > 0) {
            let other = scenePictureList.find(element => {
                return element.zIndex === scenePicture.zIndex - 1;
            });

            other.zIndex++;
            scenePicture.zIndex--;
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
        let scenePicture = this.props.store.scene.scenePictures[index];

        return <div>
            <div>Name: {scenePicture.name}</div>
            <div>X:<InputTranslateX scenePicture={scenePicture}/></div>
            <div>Y:<InputTranslateY scenePicture={scenePicture}/></div>
            <div>Scale:<InputScale scenePicture={scenePicture}/></div>
            <div>Rotate:<InputRotate scenePicture={scenePicture}/></div>
            <div>Z: {scenePicture.zIndex}</div>
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

class StoreControl extends React.Component {
    constructor() {
        super();
        this.saveScene = this.saveScene.bind(this);
        this.catalogue = this.catalogue.bind(this);
        this.loadServer = this.loadServer.bind(this);
    }

    saveScene(){
        const store = this.props.store;
        const scene = store.scene;
        scene.name = document.getElementById("sceneName").value;

        if (scene.id === 0) {
            persistence.saveScene(scene).then(result => {
                const saveScene = result.data.saveScene;
                store.scene.id = saveScene.id;
                store.scene.savedAt = saveScene.savedAt;
                redraw();
            })
        }
        else {
            persistence.updateScene(scene).then(result => {
                const saveScene = result.data.updateScene;
                store.scene.id = saveScene.id;
                store.scene.savedAt = saveScene.savedAt;
                redraw();
            })
        }
    }
    
    loadServer() {
        const list = persistence.getPictureList();
        list.then(result => {
            let store = this.props.store;

            store.display.pictureList = result;
            store.display.page = Constants.page.SERVER_LAYOUT;
            redraw();
        });
    }

    splitTime(timestamp) {
        const timeList = timestamp.split(" ");
        const date = timeList.slice(0, 3).join(" ");
        return [date, timeList[4]];
    }

    catalogue() {
        let store = this.props.store;
        store.display.page = Constants.page.CATALOGUE;
        redraw();
    }

    render() {
        const store = this.props.store;

        const style = {
            display:        "inline-block",
            verticalAlign:  "top"
        };

        const input = {
            width: "10em"
        };

        let id = "";
        let date = "";
        let time = "";
        if (store.scene.id != 0) {
            id = store.scene.id.toString();
            [date, time] = this.splitTime(store.scene.savedAt);
        }

        return <div className="control_container" style={style}>
            <div>
                <div>{id}</div>
                <div>Name: </div>
                <div><input id="sceneName" style={input}/></div>
                <div>{date}</div>
                <div>{time}</div>
            </div>
            <div><button onClick={this.catalogue}>Catalogue</button></div>
            <div><button onClick={this.loadServer}>Load Server Picture</button></div>
            <div><button onClick={this.saveScene}>Save Scene</button></div>
        </div>
    }
}

class After extends React.Component{
    render() {
        const style = {
            display:        "inline-block",
            verticalAlign:  "top"
        };

        return <div className="control_container" style={style}>
            <StoreControl store = {this.props.store}/>
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

