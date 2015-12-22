import React from "react";
import ReactDOM from "react-dom";

const Title = React.createClass({
    render: () => {
        return <div id="title">
            <h1>Try These On</h1>
        </div>
    }
});

const Before = React.createClass({
    render: () => {
        return <div id="before" >
            <Picture />
        </div>
    }
});

const Picture = React.createClass({
    render: () => {
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

const Edit = React.createClass({
    render: () => {
        return <div id="edit">
            &nbsp;
        </div>
    }
});

const After = React.createClass({
    render: () => {
        return <div id="after">
            &nbsp;
        </div>
    }
});

const Container = React.createClass({
    render: () => {
        return <div id="container">
            <Before />
            <Edit />
            <After />
        </div>
    }
});

const Parent = React.createClass({
    render: () => {
        return <div id="parent">
            <Title />
            <Container />
        </div>
    }
});

ReactDOM.render(<Parent />, document.getElementById('bigbox'));

