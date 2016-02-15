import React from 'react';
import PubSub from 'pubsub-js';
import { SEARCH_DONE, FILTER_CHANGE, FILTER_SELECT, FILTER_UNSELECT } from '../constants.jsx';

function updateKeys(arr) {

}

export default class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Filters';
        this.filterIdPrefix = 'filter_';
        this.defaultKeys = ['_id', '_index', '_score', '_type'];
        this.subscribers = [];
        this.state = {
            keys: ['_id', '_index', '_score', '_type'], // 初始化内置这些key
            keysChecked: []
        }
    }

    componentDidMount() {
        this.subscribers.push(
            PubSub.subscribe(SEARCH_DONE, (msg, data) => {
                if (data.hits && data.hits.length) {
                    var hit = data.hits[0]
                    var { keysChecked } = this.state;
                    var keys = this.defaultKeys.concat([]);
                    var tmp = [];

                    if (hit['_source']) {
                        for (var key in hit['_source']) {
                            keys.push(key);
                        }
                    }

                    keysChecked.map((el, i) => {
                        keys.indexOf(el) >= 0 && tmp.push(el);
                    })

                    this.setState({
                        keys: keys,
                        keysChecked: tmp
                    });

                    PubSub.publish(FILTER_CHANGE, tmp);
                }
            })
        )
    }

    componentWillUnmount() {
        this.subscribers.map(el => PubSub.unsubscribe(el)); // 注销监听
    }

    handleFilterClick(flag, key, index) {
        var { keys, keysChecked } = this.state;

        if (flag) { // 从过滤字段剔除
            keysChecked.splice(index, 1);
        } else {
            keysChecked.push(key);
        }

        this.setState({
            keys: keys,
            keysChecked: keysChecked
        })

        PubSub.publish(FILTER_CHANGE, keysChecked);
    }

    render() {
        var { keys, keysChecked } = this.state;

        var filters = keys.map((el, i) => {
            var filterId = this.filterIdPrefix + el;

            if (keysChecked.indexOf(el) >= 0) {
                return null;
            }

            return (
                <li key={i}>
                    <input id={filterId} type="checkbox" onChange={this.handleFilterClick.bind(this, false, el, i)}/>
                    <label htmlFor={filterId} title={el}>{el}</label>
                </li>
            );
        })

        var checkedFilters = keysChecked.map((el, i) => {
            var filterId = this.filterIdPrefix + el;
            return (
                <li key={i}>
                    <input id={filterId} type="checkbox" onChange={this.handleFilterClick.bind(this, true, el, i)} checked />
                    <label htmlFor={filterId} title={el}>{el}</label>
                </li>
            )
        })

        return (
            <div className="filter-wrapper">
                <h2>过滤字段</h2>
                <ul>{checkedFilters}</ul>
                <h2>其他字段</h2>
                <ul>{filters}</ul>
            </div>
        );
    }
}
