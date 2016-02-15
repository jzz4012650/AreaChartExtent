import React from 'react';

export default class TableExpansion extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TableExpansion';
    }
    render() {
        var { expandIndex, hits } = this.props;
        var hit = expandIndex >= 0 ? hits[expandIndex]['_source'] : {};
        var rows = [];
console.log(hit)
        for (var key in hit) {
            rows.push(
                <tr key={key}>
                    <td><i className="icon icon-add_circle"></i></td>
                    <td>{key}</td>
                    <td>{hit[key]}</td>
                </tr>
            )
        };

        return (
            <tr>
                <td colSpan="2" className="td-feild-expand">
                    <div className="feild-expand">
                        <h3>字段</h3>
                        <i className="icon icon-clear" onClick={this.props.handleExpandClose}></i>
                        <table className="feild-wrapper">
                            <tbody>{rows}</tbody>
                        </table>
                    </div>
                </td>
            </tr>
        );
    }
}

TableExpansion.propTypes = {

}