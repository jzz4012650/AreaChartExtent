import React from 'react';
import PubSub from 'pubsub-js';
import TableExpansion from './TableExpansion.jsx';
import { SEARCH_DONE, FILTER_CHANGE } from '../constants.jsx';

export default class ResultTable extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ResultTable';
        this.subscribers = [];
        this.state = {
            hits: [],
            filters: [],
            total: 0,
            expandIndex: -1
        }
    }

    componentDidMount() {
        // 搜索结果
        this.subscribers.push(
            PubSub.subscribe(SEARCH_DONE, (msg, data) => {
                this.setState({
                    hits: data.hits,
                    total: data.total
                })
            })
        )

        // 字段过滤
        this.subscribers.push(
            PubSub.subscribe(FILTER_CHANGE, (msg, data) => {
                this.setState({
                    filters: data,
                    expandIndex: -1
                })
            })
        )
    }

    componentDidUpdate(prevProps, prevState) {
        var ths = this.refs['thead'].querySelectorAll('li');
        var tr = this.refs['tbody'].querySelector('tr');
        var tds = tr && tr.querySelectorAll('td');

        if (tds && tds.length) {
            for (var i = 0, l = tds.length; i < l; i++) {
                ths[i].style.width = tds[i].clientWidth + 'px';
            }
        }
    }

    componentWillUnmount() {
        this.subscribers.map(el => PubSub.unsubscribe(el)); // 注销监听
    }

    handleTabelScroll(e, a) {
        this.refs.theadWrapper.scrollLeft = e.target.scrollLeft;
    }

    handleExpandOpen(i) {
        if (i === this.state.expandIndex) {
            this.setState({expandIndex: -1})
        } else {
            this.setState({expandIndex: i})
        }
    }

    handleExpandClose() {
        this.setState({expandIndex: -1});
    }

    render() {
        var { hits, filters, expandIndex } = this.state;

        var theads = filters.map((el, i) => <li key={i} title={el}>{el}</li>);

        var resultRow = hits.map((el, i) => {
            var resultTds = filters.length ?
                filters.map((key, j) => <td key={j}>{JSON.stringify(el[key] || el['_source'][key])}</td>) :
                <td>{JSON.stringify(el['_source'])}</td>
            return ([
                <tr key={i}>
                    {filters.length ? null : <td><i className={'icon icon-' + (expandIndex == i ? 'expand_more' : 'navigate_next')} onClick={this.handleExpandOpen.bind(this, i)}></i></td>}
                    {resultTds}
                </tr>,
                (expandIndex == i ? <TableExpansion {...this.state} handleExpandClose={this.handleExpandClose.bind(this)}/> : null)
            ]);
        })

        // if (expandIndex >= 0) {
        //     resultRow = resultRow.splice(expandIndex, 0, <tr><td></td><td></td></tr>);
        // }

        return (
            <div className="result-table-wrapper">
                <div className="table-header" ref="theadWrapper">
                    <ul ref="thead">
                        {filters.length ? null : <li></li>}
                        {filters.length <= 0 ? <li>查询结果</li> : theads}
                    </ul>
                </div>
                <div className="table-body" onScroll={this.handleTabelScroll.bind(this)}>
                    <table>
                        <tbody ref="tbody">
                            {resultRow}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
