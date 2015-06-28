var $                       = require('jquery');
var Alert                   = require('react-bootstrap').Alert;
var Backbone                = require('backbone');
var Bootstrap               = require('react-bootstrap');
var Button                  = require('react-bootstrap').Button;
var Griddle                 = require('griddle-react');
var Loader                  = require('react-loader');
var Modal                   = require('react-bootstrap').Modal;
var OverlayMixin            = require('react-bootstrap').OverlayMixin;
var ButtonToolbar           = require('react-bootstrap').ButtonToolbar;
var DropdownButton          = require('react-bootstrap').DropdownButton;
var MenuItem                = require('react-bootstrap').MenuItem;
var ModalTrigger            = require('react-bootstrap').ModalTrigger;
var React                   = require('react');
var TimeoutTransitionGroup  = require('../react-components/js/timeout-transition-group.jsx');

var Alert                   = Bootstrap.Alert;
var Button                  = Bootstrap.Button;
var ButtonToolbar           = Bootstrap.ButtonToolbar;
var Nav                     = Bootstrap.Nav;
var NavItem                 = Bootstrap.NavItem;
var Navbar                  = Bootstrap.Navbar;
var Panel                   = Bootstrap.Panel;
var ProgressBar             = Bootstrap.ProgressBar;

var device = null;
var _url   = 'http://agile-oasis-7393.herokuapp.com';

var NotificationList = React.createClass({
    handleDismiss: function(item) {
        var messages = this.state.messages;
        delete messages[item];
        this.setState({messages: messages});
    },
    addMessage: function(message) {
        var messages = this.state.messages,
            count = this.state.msgCount;
        messages[++count] = message;
        this.setState({
            msgCount: count,
            messages: messages
        });
    },
    getInitialState: function() {
        return {
            messages: {},
            msgCount: 0
        };
    },
    render: function() {
        var collection = this.state.messages,
            messages = [];
        for (var key in collection) {
            var item = collection[key];
            item.key = key;
            messages.push(item);
        }
        return (
            <TimeoutTransitionGroup enterTimeout={500} leaveTimeout={500} transitionName="fade">
                {messages.map(function(item) {
                    return (
                        <Alert key={item.key} bsStyle={item.type} dismissAfter={4500} onDismiss={this.handleDismiss.bind(this, item.key)}>
                            {item.text}
                        </Alert>
                    );
                }.bind(this))}
            </TimeoutTransitionGroup>
        );
    }
});

var DeleteNodeModal = React.createClass({
    handleConfirm: function() {
        this.props.deleteHandler(this.props.nodeId);
        this.props.onRequestHide();
    },
    render: function() {
        return (
            <Modal title="Confirm action" onRequestHide={this.props.onRequestHide}>
                <div className="modal-body">
                    Are you sure?
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onRequestHide}>Cancel</Button>
                    <Button bsStyle="primary" onClick={this.handleConfirm}>Delete</Button>
                </div>
            </Modal>
        );
    }
});

var CreateVirtualNodeModal = React.createClass({
    getInitialState: function() {
        return {
            nodeName: '',
            errors: {}
        };
    },
    handleSaveNode: function() {
        var errors = {};
        if (!this.state.nodeName) {
            errors['nodeName'] = 'This field is required.';
        }
        if (!Object.keys(errors).length) {
            var data = {
                name: this.state.nodeName,
                type: "virtual"
            };
            this.props.saveHandler(data);
            this.props.onRequestHide();
        } else {
            this.setState({errors: errors});
        }
    },
    handleChange: function(field, event) {
        var next = {};
        next[field] = event.target.value;
        this.setState(next);
    },
    componentDidMount: function() {
        React.findDOMNode(this.refs.nodeName).focus();
    },
    renderErrors: function(field) {
        var msg = this.state.errors[field];
        if (msg) {
            return (
                <span className="help-block">
                    {msg}
                </span>
            );
        }
        return <span/>;
    },
    render: function() {
        return (
            <Modal title="New virtual node" onRequestHide={this.props.onRequestHide}>
                <div className="modal-body">
                    <div className={!!this.state.errors['nodeName'] ? 'form-group has-error' : 'form-group'}>
                        <label htmlFor="name">Name</label>
                        <input 
                            ref="nodeName"
                            type="text" 
                            id="name"
                            className="form-control" 
                            onChange={this.handleChange.bind(this, 'nodeName')}
                            value={this.state.nodeName} />
                        {this.renderErrors('nodeName')}
                    </div>
                </div>
                <div className="modal-footer">
                    <Button 
                        onClick={this.props.onRequestHide}>
                        Cancel
                    </Button>
                    <Button 
                        bsStyle="primary" 
                        onClick={this.handleSaveNode}>
                        Save
                    </Button>
                </div>
            </Modal>
        );
    }
});

var CreateDeviceNodeModal = React.createClass({
    getInitialState: function() {
        return {
            nodeName: '',
            nodePass: '',
            nodeConfirm: '',
            errors: {}
        };
    },
    handleSaveNode: function() {
        var errors = {};
        if (!this.state.nodeName) {
            errors['nodeName'] = 'This field is required.';
        }
        if (!this.state.nodePass) {
            errors['nodePass'] = 'This field is required.';
        }
        if (!this.state.nodeConfirm) {
            errors['nodeConfirm'] = 'This field is required.';
        } else if (this.state.nodePass.length < 6) {
            errors['nodePass'] = 'Password is too short.';
        } else if (this.state.nodePass != this.state.nodeConfirm) {
            errors['nodeConfirm'] = 'Passwords do not match.';
        }
        if (!Object.keys(errors).length) {
            var data = {
                name: this.state.nodeName,
                device: this.state.nodeName + ':' + this.state.nodePass,
                type: "device"
            };
            this.props.saveHandler(data);
            this.props.onRequestHide();
        } else {
            this.setState({errors: errors});
        }
    },
    handleChange: function(field, event) {
        var next = {};
        next[field] = event.target.value;
        this.setState(next);
    },
    componentDidMount: function() {
        React.findDOMNode(this.refs.nodeName).focus();
    },
    renderErrors: function(field) {
        var msg = this.state.errors[field];
        if (msg) {
            return (
                <span className="help-block">
                    {msg}
                </span>
            );
        }
        return <span/>;
    },
    render: function() {
        return (
            <Modal ref="banan" title="New device node" onRequestHide={this.props.onRequestHide}>
                <div className="modal-body">
                    <div className={!!this.state.errors['nodeName'] ? 'form-group has-error' : 'form-group'}>
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            onChange={this.handleChange.bind(this, 'nodeName')}
                            value={this.state.nodeName}
                            ref="nodeName"
                            required 
                            autofocus />
                        {this.renderErrors('nodeName')}
                    </div>
                    <div className={!!this.state.errors['nodePass'] ? 'form-group has-error' : 'form-group'}>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            onChange={this.handleChange.bind(this, 'nodePass')}
                            value={this.state.nodePass}
                            ref="nodePass"
                            required 
                            autofocus />
                        {this.renderErrors('nodePass')}
                    </div>
                    <div className={!!this.state.errors['nodeConfirm'] ? 'form-group has-error' : 'form-group'}>
                        <label htmlFor="confirmation">Confirm password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            onChange={this.handleChange.bind(this, 'nodeConfirm')}
                            value={this.state.nodeConfirm}
                            ref="nodeConfirm"
                            required 
                            required 
                            autofocus />
                        {this.renderErrors('nodeConfirm')}
                    </div>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onRequestHide}>Cancel</Button>
                    <Button bsStyle="primary" onClick={this.handleSaveNode}>Save</Button>
                </div>
            </Modal>
        );
    }
});

var NodeStore = {
    data: []
};

var NodesView = React.createClass({
    handleSubmit: function() {
        var data = {
            name: this.state.nodeName,
            targets: [] 
        };
        for (var key in this.state.nodeTargets) {
            if (true == this.state.nodeTargets[key])
                data.targets.push(Number(key));
        }
        $.ajax({
            url: _url + '/nodes/' + this.state.nodeId,
            type: 'PUT',
            data: JSON.stringify(data),
            headers: {
                "Authorization": "Basic " + btoa(device)
            },
            error: function(e) {
                console.log(e);
            },
            success: function() {
                this.refs.notifications.addMessage({
                    type: 'success',
                    text: 'Node has been updated.'
                });
            }.bind(this)
        });
    },
    handleCancel: function() {
        window.location.hash = 'nodes';
    },
    handleChange: function(event) {
        this.setState({
            nodeName: event.target.value
        });
    },
    handleCheckbox: function(event) {
        var id = event.target.getAttribute('data-id');
        var targets = this.state.nodeTargets;
        targets[id] = !targets[id];
        this.setState({
            nodeTargets: targets
        });
    },
    getInitialState: function() {
        var nodes = NodeStore.data
            node = {name: ''},
            targets = {};
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id == this.props.nodeId) {
                node = nodes[i];
            }
            targets[nodes[i].id] = false;
        }
        for (var i = 0; i < nodes.length; i++) 
            if (node.targets.indexOf(nodes[i].id) !== -1)
                targets[nodes[i].id] = true;
        return {
            nodeName: node.name,
            nodeId: node.id,
            nodeTargets: targets
        };
    },
    render: function() {
        var nodes = NodeStore.data;
        return (
            <div>
                <NotificationList ref="notifications" />
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="form-group">
                            <label htmlFor="name">Node name</label>
                            <input className="form-control" id="name" type="text" onChange={this.handleChange} value={this.state.nodeName} />
                        </div>
                        <label>Target nodes</label>
                        <span className="help-block">When processing sync requests from this node, only actions from selected targets are included in the result.</span>
                        {nodes.map(function(node) {
                            var item = <span />
                            if (node.id != this.state.nodeId) {
                                item = (
                                        <label className="noselect" htmlFor={'node-' + node.id + '-name'}>
                                            <input data-id={node.id} id={'node-' + node.id + '-name'} type="checkbox" onChange={this.handleCheckbox} checked={this.state.nodeTargets[node.id]} />
                                            {node.name}
                                        </label>
                                    );
                            }
                            return (
                                <div className="checkbox" key={node.id}>
                                    {item}
                                </div>
                            );
                        }.bind(this))}
                        <hr />
                        <div className="form-group">
                            <button onClick={this.handleSubmit} type="button" className="btn btn-primary">
                                Save changes
                            </button>
                            &nbsp;<button onClick={this.handleCancel} type="button" className="btn btn-default">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var NodesListView = React.createClass({
    getInitialState: function() {
        return {
            data: [], 
            loaded: false
        };
    },
    getExternalData: function() {
        $.ajax({
            url: _url + '/nodes',
            headers: {
                "Authorization": "Basic " + btoa(device)
            },
            error: function(e) {
                console.log(e);
            },
            success: function(resp) {
                NodeStore.data = resp['_embedded']['nodes'];
                this.setState({
                    data: NodeStore.data, 
                    loaded: true
                });
            }.bind(this)
        });
    },
    saveNode: function(node) {
        $.ajax({
            url: _url + '/nodes',
            type: 'POST',
            data: JSON.stringify(node),
            headers: {
                "Authorization": "Basic " + btoa(device)
            },
            error: function(e) {
                console.log(e);
            }.bind(this),
            success: function(resp) {
                this.refs.notifications.addMessage({
                    type: 'success',
                    text: 'The node was created.'
                });
                this.refresh();
            }.bind(this)
        });
    },
    deleteNode: function(id) {
        $.ajax({
            url: _url + '/nodes/' + id,
            type: 'DELETE',
            headers: {
                "Authorization": "Basic " + btoa(device)
            },
            error: function(e) {
                console.log(e);
            }.bind(this),
            success: function(resp) {
                this.refs.notifications.addMessage({
                    type: 'success',
                    text: 'The node was deleted.'
                });
                this.refresh();
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.getExternalData();
    },
    refresh: function() {
        this.setState({loaded: false});
        this.getExternalData();
    },
    void: function() {},
    render: function() {
        var that = this;
        var metadata = [{
            "columnName": "id",
            "order": 1,
            "locked": false,
            "visible": true,
            "displayName": "Id"
        },
        {
            "columnName": "name",
            "order": 2,
            "locked": true,
            "visible": true,
            "displayName": "Name",
            "customComponent": React.createClass({
                render: function() {
                    return (
                        <a href={'#nodes/' + this.props.rowData.id}>{this.props.rowData.name}</a>
                    );
                }
            })
        },
        {
            "columnName": "type",
            "order": 3,
            "locked": false,
            "visible": true,
            "displayName": "Type"
        },
        {
            "columnName": "meta",
            "order": 4,
            "locked": true,
            "visible": true,
            "displayName": "",
            "customComponent": React.createClass({
                render: function() {
                    if (this.props.rowData.locked) {
                        return (
                            <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
                        );
                    }
                    return (
                        <ModalTrigger modal={<DeleteNodeModal nodeId={this.props.rowData.id} deleteHandler={that.deleteNode} />}>
                            <a href="javascript:">Remove</a>
                        </ModalTrigger>
                    );
                }
            })
        }];
        return (
            <div>
                <NotificationList ref="notifications" />
                <Loader color="#2c3e50" loaded={this.state.loaded}>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <button onClick={this.refresh} type="button" className="btn btn-default pull-right">
                                <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                            </button>
                            <ButtonToolbar>
                                <DropdownButton bsStyle="primary" title="New node">
                                    <ModalTrigger modal={<CreateDeviceNodeModal saveHandler={this.saveNode} />}>
                                        <MenuItem onSelect={this.void} eventKey="1">Device</MenuItem>
                                    </ModalTrigger>
                                    <ModalTrigger modal={<CreateVirtualNodeModal saveHandler={this.saveNode} />}>
                                        <MenuItem onSelect={this.void} eventKey="2">Virtual</MenuItem>
                                    </ModalTrigger>
                                </DropdownButton>
                            </ButtonToolbar>
                        </div>
                        <div className="panel-body">
                            <Griddle 
                                resultsPerPage={25} 
                                useGriddleStyles={false} 
                                tableClassName="table table-bordered" 
                                showFilter={true} 
                                columns={["id", "name", "type", "meta"]} 
                                initialSort="id"
                                columnMetadata={metadata} 
                                useCustomPagerComponent="true" 
                                customPagerComponent={BootstrapPager} 
                                results={this.state.data} />
                        </div>
                    </div>
                </Loader>
            </div>
        );
    }
});

var ObjectComponent = React.createClass({
    stringify: function(str) {
        return JSON.stringify(this.props.data, null, 2);
    },
    render: function() {
        return (
            <pre>{this.stringify()}</pre>
        );
    }
});

var TransactionsView = React.createClass({
    mixins: [OverlayMixin],
    getInitialState: function() {
        return {
            data: [], 
            loaded: false,
            currentPage: 0,
            maxPages: 0,
            externalResultsPerPage: 15,
            total: 0,
            modalOpen: false
        };
    },
    getExternalData: function(page, resultsPerPage) {
        $.ajax({
            url: _url + '/log?page=' + page + '&size=' + resultsPerPage,
            headers: {
                "Authorization": "Basic " + btoa(device)
            },
            error: function(e) {
                console.log(e);
            },
            success: function(resp) {
                this.setState({
                    data: resp['_embedded']['transactions'], 
                    loaded: true,
                    currentPage: page-1,
                    maxPages: Math.round(resp.total / resultsPerPage),
                    total: resp.total
                });
            }.bind(this)
        });
    },
    showDialog: function(message) {
        this.setState({
            modalOpen: true,
            modalMessage: message
        });
    },
    handleToggle: function() {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    },
    setPageSize: function(size) {
        this.getExternalData(1, size);
    },
    setPage: function(index) {
        index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1;
        this.getExternalData(index, this.state.externalResultsPerPage);
    },
    refresh: function() {
        this.setState({loaded: false});
        this.getExternalData(this.state.currentPage+1, this.state.externalResultsPerPage);
    },
    confirmClearLog: function() {
        this.showDialog('Are you sure?');
    },
    clearLog: function() {
        $.ajax({
            url: _url + '/log/reset',
            type: 'POST',
            headers: {
                "Authorization": "Basic " + btoa(device)
            },
            error: function(e) {
                console.log(e);
            },
            success: function() {
                this.setState({
                    modalOpen: !this.state.modalOpen,
                    loaded: false
                });
                this.getExternalData(1, this.state.externalResultsPerPage);
                this.refs.notifications.addMessage({
                    type: 'success',
                    text: 'The log has been reset.'
                });
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.getExternalData(1, this.state.externalResultsPerPage);
    },
    renderOverlay: function() {
        if (!this.state.modalOpen) {
            return <span/>;
        }
        return (
            <Modal title="Confirm action" onRequestHide={this.handleToggle}>
                <div className="modal-body">
                    {this.state.modalMessage}
                </div>
                <div className="modal-footer">
                    <Button onClick={this.handleToggle}>Cancel</Button>
                    <Button bsStyle="primary" onClick={this.clearLog}>Clear log</Button>
                </div>
            </Modal>
        );
    },
    render: function() {
        var metadata = [{
            "columnName": "timestamp",
            "order": 1,
            "locked": false,
            "visible": true,
            "displayName": "Timestamp"
        },
        {
            "columnName": "commitId",
            "order": 2,
            "locked": false,
            "visible": true,
            "displayName": "Commit"
        },
        {
            "columnName": "batchIndex",
            "order": 3,
            "locked": false,
            "visible": true,
            "displayName": "Index"
        },
        {
            "columnName": "nodeId",
            "order": 4,
            "locked": false,
            "visible": true,
            "displayName": "Node"
        },
        {
            "columnName": "range",
            "order": 5,
            "locked": false,
            "visible": true,
            "displayName": "Range",
            "customComponent": React.createClass({
                render: function() {
                    var nums = [], 
                        data = this.props.data.sort(function(a, b) { return a - b; });
                    return (
                        <span>{JSON.stringify(data)}</span>
                    );
                }
            })
        },
        {
            "columnName": "up",
            "order": 6,
            "locked": false,
            "visible": true,
            "displayName": "Up",
            "customComponent": ObjectComponent
        },
        {
            "columnName": "down",
            "order": 7,
            "locked": false,
            "visible": true,
            "displayName": "Down",
            "customComponent": ObjectComponent
        }];
        return (
            <div>
                <NotificationList ref="notifications" />
                <Loader color="#2c3e50" loaded={this.state.loaded}>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <button onClick={this.refresh} type="button" className="btn btn-default pull-right">
                                <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                            </button>
                            <button onClick={this.confirmClearLog} type="button" className="btn btn-danger">Clear log</button>
                        </div>
                        <div className="panel-body">
                            <Griddle 
                                useExternal={true}
                                externalMaxPage={this.state.maxPages}
                                externalCurrentPage={this.state.currentPage}
                                externalSetPage={this.setPage}
                                externalChangeSort={function(){}} 
                                externalSetFilter={function(){}}
                                externalSetPageSize={this.setPageSize}
                                resultsPerPage={this.state.externalResultsPerPage} 
                                useGriddleStyles={false} 
                                tableClassName="table table-bordered" 
                                columns={["timestamp", "commitId", "batchIndex", "nodeId", "range", "up", "down"]} 
                                columnMetadata={metadata} 
                                showFilter={false} 
                                useCustomPagerComponent="true" 
                                customPagerComponent={BootstrapPager} 
                                results={this.state.data} />
                        </div>
                    </div>
                </Loader>
            </div>
        );
    }
});

var BootstrapPager = React.createClass({
    getDefaultProps: function() {
        return {
            "maxPage": 0,
            "currentPage": 0,
        };
    },
    pageChange: function(event) {
        this.props.setPage(parseInt(event.target.getAttribute("data-value")));
    },
    render: function() {
        var firstClass = this.props.currentPage > 0 ? "" : "disabled",
            lastClass  = this.props.currentPage != (this.props.maxPage - 1) ? "" : "disabled";
        prev = 
            <li className={firstClass}>
                <a href="javascript:" onClick={this.props.previous} aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        next =
            <li className={lastClass}>
                <a href="javascript:" onClick={this.props.next} aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        var options = [],
            startIndex = Math.max(this.props.currentPage - 5, 0),
            endIndex = Math.min(startIndex + 11, this.props.maxPage);
        if (this.props.maxPage >= 11 && (endIndex - startIndex) <= 10) {
            startIndex = endIndex - 11;
        }
        var current = this.props.currentPage;
        for(var i = startIndex; i < endIndex; i++){
            var selected = current == i ? "active" : "";
            options.push(<li key={i} className={selected}><a href="javascript:" data-value={i} onClick={this.pageChange}>{i + 1}</a></li>);
        }
        if (options.length <= 1)
            return <span/>;
        return (
            <nav>
                <ul className="pagination">
                    {prev}
                    {options}
                    {next}
                </ul>
            </nav>
        );
    }
});

var SignInForm = React.createClass({
    onSubmit: function() {
        device = 'root:root';
        $('.navbar-nav').show();
        Backbone.history.stop(); 
        Backbone.history.start();
    },
    render: function() {
        return (
            <div>
                <div>
                    <h3 className="text-center">Please sign in</h3>
                    <div className="form-group">
                        <label htmlFor="host">Host</label>
                        <input type="text" ref="signinHost" className="form-control" placeholder="http://enigmatic-reaches-6505.herokuapp.com" required autofocus />
                    </div>
                    <div className="form-group">
                        <label htmlFor="admin-key">Administrator key</label>
                        <input type="text" ref="signinKey" className="form-control" placeholder="demo" required autofocus />
                    </div>
                    <div className="form-group">
                        <label htmlFor="admin-secret">Secret</label>
                        <input type="password" ref="signinSecret" className="form-control" placeholder="gh6jyg3X5ggsUnqxPKjYRPrajsNC4U4w" required />
                    </div>
                </div>
                <button onClick={this.onSubmit} className="btn btn-primary btn-block" type="submit">Sign in</button>
            </div>
        );
    }
});

var Router = Backbone.Router.extend({
    routes: {
        ""                   : "index",
        "transactions"       : "listTransactions",
        "nodes/:id"          : "editNode",
        "nodes"              : "listNodes",
        "signout"            : "signOut"
    },
    index: function() {
        if (device) {
            window.location.hash = 'nodes';
            return;
        }
        $('.navbar-nav').hide();
        React.render(
            <SignInForm />,
            document.getElementById('main')
        );
    },
    listTransactions: function() {
        if (!device) {
            window.location.hash = '';
            return;
        }
        React.render(
            <TransactionsView />,
            document.getElementById('main')
        );
    },
    editNode: function(id) {
        if (!device) {
            window.location.hash = '';
            return;
        }
        React.render(
            <NodesView nodeId={id} />,
            document.getElementById('main')
        );
    },
    listNodes: function() {
        if (!device) {
            window.location.hash = '';
            return;
        }
        React.render(
            <NodesListView />,
            document.getElementById('main')
        );
    },
    signOut: function() {
        device = null;
        window.location.hash ='';
    }
});

var NavComponent = React.createClass({
    handleSignOut: function() {
        window.location.hash = 'signout';
    },
    render: function() {
        return (
            <div>
                <Navbar className="navbar-inverse navbar-fixed-top" brand={<a href="#">Sphere Access</a>} toggleNavKey={0}>
                    <button onClick={this.handleSignOut} className="btn btn-primary navbar-btn btn-sm pull-right">
                        <span className="glyphicon glyphicon-log-out" aria-hidden="true"></span>&nbsp;Sign out
                    </button>
                    <Nav eventKey={0}>
                        <NavItem eventKey={1} href="#nodes">Nodes</NavItem> 
                        <NavItem eventKey={2} href="#transactions">Transaction log</NavItem> 
                    </Nav>
                </Navbar>
            </div>
        );
    }
});
           
var router = new Router();
Backbone.history.start();

React.render(
    <NavComponent />,
    document.getElementById('navbar-container')
);

// Close responsive Bootstrap nav when selecting an item
$('.navbar-collapse a').on('click', function() {
    if ($('body').width() < 768) {
        $(".navbar-toggle").click();
    }
});
