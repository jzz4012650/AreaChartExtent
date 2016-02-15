import React from 'react';
// import { Router, Route, Link } from 'react-router';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Header';
    }
    render() {
        return (
            <div className="main-header">
                <div className="user-wrapper">
                    <i className="icon icon-account_circle"></i>
                    <span className="user-name">User</span>
                    <i className="icon icon-expand_more"></i>
                </div>
                <div className="logo">Skylar</div>
            </div>
        );
    }
}