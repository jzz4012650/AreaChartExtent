import $ from 'jquery';
import React from 'react';
import { MenuItem, Button ,Table } from 'react-bootstrap';
import { UP_KEY, DOWN_KEY, SPACE_KEY, ENTER_KEY, BACK_KEY } from "../constants.jsx";

export default class EnhancedInput extends React.Component {
    constructor(props) {
        super(props);
        this.displayName  = 'EnhancedInput';
        this.DELAY_TIME   = 300;
        this.REQUEST_URL  = 'http://10.18.31.32:6001/completion.json?jsoncallback=?';
        this.SEARCH_URL   = 'http://10.18.31.32:6001/search.json?jsoncallback=?';
        this.requestDelay = null;
        this.request      = null;
        this.search       = null;
        this.state = {
            leftIndent: 0,
            promptIndex: 0,
            inputContent: "",
            showPrompt: false,
            promptsRaw: [],
            prompts: [],
            searchKeys: [],
            conditions: [],
            searchResult: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        var width = 0;
        var needUpdate = prevState.conditions.toString() !== this.state.conditions.toString();

        if (needUpdate) {
            var conditions = this.refs.wrapper.querySelectorAll('.condtion');
            for (var i = conditions.length - 1; i >= 0; i--) {
                width += conditions[i].clientWidth + 3 + 2;
            };
            this.setState({
                leftIndent: width
            })
        }
    }

    handleKeyAction(e) {
        var keyCode = e.nativeEvent.keyCode;
        var value = e.target.value;

        switch (keyCode) {
            case UP_KEY:
                e.preventDefault();
                this.movePromptIndex(true);
                break;
            case DOWN_KEY:
                e.preventDefault();
                this.movePromptIndex(false);
                break;
            case BACK_KEY:
                value === "" && this.deleteCondition();
                break;
            case ENTER_KEY:
                var selectedPrompt = "";
                if (this.state.showPrompt && this.state.prompts[this.state.promptIndex]) {
                    selectedPrompt = this.state.prompts[this.state.promptIndex];
                } else {
                    selectedPrompt = this.state.inputContent;
                }
                this.addCondition(selectedPrompt);
        }
    }

    movePromptIndex(up) {
        var index = this.state.promptIndex;
        var length = this.state.prompts.length;
        if (up) {
            index = Math.abs(index - 1 % length);
        } else {
            index = (index + 1) % length;
        }
        this.setState({
            promptIndex: index
        });
    }

    addCondition(content) {
        var prompts = this.state.prompts;
        var promptsRaw = this.state.promptsRaw;
        var index = this.state.promptIndex;
        var searchKey = "";

        if (prompts.length && prompts[index] && promptsRaw[index]) {
            searchKey = promptsRaw[index]['Namespace'] + '.' + promptsRaw[index]['Name'];
        } else {
            searchKey = content;
        }

        this.setState({
            promptIndex: 0,
            showPrompt: false,
            inputContent: "",
            promptsRaw: [],
            prompts: [],
            searchKeys: [...this.state.searchKeys, searchKey],
            conditions: [...this.state.conditions, content]
        });

        this.refs.input.focus();
    }

    deleteCondition() {
        var length = this.state.conditions.length;
        this.setState({
            promptIndex: 0,
            showPrompt: false,
            inputContent: "",
            searchKeys: [...this.state.searchKeys.splice(0, length-1)],
            conditions: [...this.state.conditions.splice(0, length-1)]
        })
    }

    handleInput(e) {
        var _this = this;

        this.setState({
            inputContent: e.target.value
        });

        clearTimeout(this.requestDelay);

        this.requestDelay = setTimeout(function() {
            var value = e.target.value.trim();
            if (value !== "" && !/^["“].*["”]$/.test(value)) {
                _this.request && _this.request.abort && _this.request.abort();
                _this.request = _this.getPromptList(value.trim());
            } else {
                _this.setState({
                    showPrompt: false,
                    promptIndex: 0
                })
            }
        }, this.DELAY_TIME);
    }

    handleSearch() {
        var _this = this;
        var searchContent = this.state.searchKeys.join(" ");

        this.search && this.search.abort && this.search.abort();

        this.search = $.getJSON(this.SEARCH_URL, {
            keywords: searchContent
        }).done(function(res) {
            console.log(res)
            if (res.hits && res.hits.hits) {
                _this.setState({
                    searchResult: res.hits.hits
                })
            } else {
                _this.setState({
                    searchResult: []
                })
            }
        })
    }

    getPromptList(keyword) {
        var _this = this;

        return $.getJSON(this.REQUEST_URL, {
            keyword: keyword
        }).done(function(res) {
            if (res.length) {
                _this.setState({
                    showPrompt: true,
                    promptIndex: 0,
                    promptsRaw: res,
                    prompts: res.map(el => el.Des)
                })
            } else {
                _this.setState({
                    showPrompt: false,
                    promptIndex: 0,
                    promptsRaw: [],
                    prompts: []
                })
            }
        });
    }

    autoFocus() {
        this.refs.input.focus();
    }

    render() {
        var searchBtnStyle = {
            float: 'right'
        }

        var conditions = this.state.conditions.map((el, i) => {
            return <span key={i} className="condtion">{el}</span>;
        });

        var menuItems = this.state.prompts.map((el, i) => {
            return <MenuItem key={i} active={this.state.promptIndex == i} onClick={this.addCondition.bind(this, el)}>{el}</MenuItem>;
        })

        var rows = this.state.searchResult.map((el, i) => {
            return <tr key={i}><td>{i+1}</td><td>{JSON.stringify(el._source)}</td></tr>
        })

// onKeyUp={this.handleKeyAction.bind(this)}
        return (
            <div className="main-wrapper">
                <div>
                    <Button bsStyle="primary" bsSize="small" style={searchBtnStyle} onClick={this.handleSearch.bind(this)}>搜索</Button>
                    <div className="enhanced-input-outter" ref="wrapper" onClick={this.autoFocus.bind(this)}>
                        {conditions}
                        <div className="input-wrapper" style={{left: this.state.leftIndent + 3 + 'px'}}>
                            <ul className="dropdown-menu open" style={{display: this.state.showPrompt ? 'block' : 'none'}}>
                                {menuItems}
                            </ul>
                            <input type="text" ref="input" value={this.state.inputContent} onChange={this.handleInput.bind(this)} onKeyDown={this.handleKeyAction.bind(this)}/>
                        </div>
                    </div>
                </div>
                <p className="result-hint">搜索结果：</p>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Source</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </div>
        );
    }
}