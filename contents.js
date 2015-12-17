

const Parent = React.createClass({
    render: () => {
        return <div idName="parent">
                <Title />
                <Container />
            </div>
    }
});

const Title = React.createClass({
    render: () => {
        return <div idName="title">
            <h1>Try These On</h1>
        </div>
    }
});

const Container = React.createClass({
    render: () => {
        return <div idName="container">
            <Before />
            <Edit />
            <After />
        </div>
    }
});

const Before = React.createClass({
    render: () => {
        return <div idName="before">
            <Picture />
        </div>
    }
});

const Picture = React.createClass({
    render: () => {
        return <div idName="picture">
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
        return <div idName="edit">
            &nbsp;
        </div>
    }
});

const After = React.createClass({
    render: () => {
        return <div idName="after">
            &nbsp;
        </div>
    }
});
