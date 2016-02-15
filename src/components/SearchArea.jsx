import $ from 'jquery';
import React from 'react';
import PubSub from 'pubsub-js';
import { SEARCH_URL, SEARCH_DONE, ENTER_KEY } from '../constants.jsx';

export default class SearchArea extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SearchArea';
        this.xhr = null;
        this.state = {
            resultTotal: 0
        }
    }

    handleInputKeyDown(e) {
        if (e.nativeEvent.keyCode === ENTER_KEY) {
            this.handleSearch();
        }
    }

    handleSearch() {
        var _this = this;
        var value = this.refs.searchInput.value;

        if (value.trim() !== "") {
            // 取消上一次请求
            _this.xhr && _this.xhr.abort && _this.xhr.abort();
            _this.xhr = $.getJSON(SEARCH_URL, {
                keywords: value
            }).done(function(res) {
                if (res.hits) {
                    PubSub.publish('SEARCH_DONE', res.hits);
                    _this.setState({
                        resultTotal: res.hits.total
                    })
                }
            })
        }
    }

    render() {
        return (
            <div className="search-wrapper">
                <div className="search-submit-wrapper">
                    <select id="">
                        <option value="">系统信息</option>
                    </select>
                    <button className="search-submit" onClick={this.handleSearch.bind(this)}>搜索</button>
                </div>
                <div className="search-input-outter">
                    <i className="icon icon-search"></i>
                    <div className="search-input-wrapper">
                        <input type="text" ref="searchInput" onKeyDown={this.handleInputKeyDown.bind(this)}/>
                    </div>
                </div>
                <div className="search-result">
                    <i className="icon icon-fiber_manual_record green"></i>
                    <p>共搜索出<span>{this.state.resultTotal}</span>条结果。</p>
                </div>
            </div>
        );
    }
}