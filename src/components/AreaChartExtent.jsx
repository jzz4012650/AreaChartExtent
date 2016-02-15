import React from 'react';
import d3 from 'd3';

export default class AreaChartExtent extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'AreaChartExtent';
        this.state = {
            width: 0,
            height: 0
        }
        this.resizeDelay  = null;
        this.RESIZE_DELAY = 300;
        this.dateFormat   = d3.time.format('%b %Y');
        this.xScale       = d3.time.scale().domain(d3.extent(this.props.data, d => this.dateFormat.parse(d.date)));
        this.yScale       = d3.scale.linear().domain([0, d3.max(this.props.data, d => d.count)]);
        this.xAxis        = d3.svg.axis().scale(this.xScale).orient('bottom').tickSize(6, 0);
        this.area         = d3.svg.area().interpolate('basis').x(d => this.xScale(this.dateFormat.parse(d.date))).y(d => this.yScale(d.count));
        this.brush        = d3.svg.brush().x(this.xScale).on('brush', this.handleBrush.bind(this));
    }

    handleBrush(extent) {
        console.log(this.brush.extent())
    }

    componentDidMount() {
        this.doResize();
        d3.select(this.refs.brush).call(this.brush);
        d3.select(this.refs.axis).call(this.xAxis);
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    componentWillUnmount() {
        clearTimeout(this.resizeDelay);
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleResize() {
        clearTimeout(this.resizeDelay);
        this.resizeDelay = setTimeout(this.doResize.bind(this), this.RESIZE_DELAY);
    }

    doResize() {
        var wrapper = this.refs.svg.parentElement;
        var width = wrapper.clientWidth;
        var height = wrapper.clientHeight;
        var margin = this.props.margin;

        this.xScale.range([margin[3], width - margin[1]]);
        this.yScale.range([height - margin[2], margin[0]]);
        this.area.y0(height - margin[2]);
        this.setState({ width: width, height: height });
        d3.select(this.refs.brush).call(this.brush).selectAll('rect').attr('height', height - margin[0] - margin[2]);
        d3.select(this.refs.axis).call(this.xAxis);
    }

    render() {
        var { width, height } = this.state;
        var { margin } = this.props;

        return (
            <svg ref="svg" className="area-chart-extent" width={this.state.width} height={this.state.height}>
                <g className="area-axis" ref="axis" transform={'translate(0,' + (height - margin[2]) + ')'}></g>
                <g className="area-chart">
                    <path className="area" d={width && height && this.area(this.props.data) || null}></path>
                </g>
                <g className="area-brush" ref="brush" transform={'translate(0,' + margin[0] + ')'}></g>
            </svg>
        );
    }
}

AreaChartExtent.defaultProps = {
    margin: [20,20,40,20],
    data: [{date:"Jan 2000", count: 1394.46},
            {date:"Feb 2000", count: 1366.42},
            {date:"Mar 2000", count: 1498.58},
            {date:"Apr 2000", count: 1452.43},
            {date:"May 2000", count: 1420.6},
            {date:"Jun 2000", count: 1454.6},
            {date:"Jul 2000", count: 1430.83},
            {date:"Aug 2000", count: 1517.68},
            {date:"Sep 2000", count: 1436.51},
            {date:"Oct 2000", count: 1429.4},
            {date:"Nov 2000", count: 1314.95},
            {date:"Dec 2000", count: 1320.28},
            {date:"Jan 2001", count: 1366.01},
            {date:"Feb 2001", count: 1239.94},
            {date:"Mar 2001", count: 1160.33},
            {date:"Apr 2001", count: 1249.46},
            {date:"May 2001", count: 1255.82},
            {date:"Jun 2001", count: 1224.38},
            {date:"Jul 2001", count: 1211.23},
            {date:"Aug 2001", count: 1133.58},
            {date:"Sep 2001", count: 1040.94},
            {date:"Oct 2001", count: 1059.78},
            {date:"Nov 2001", count: 1139.45},
            {date:"Dec 2001", count: 1148.08},
            {date:"Jan 2002", count: 1130.2},
            {date:"Feb 2002", count: 1106.73},
            {date:"Mar 2002", count: 1147.39},
            {date:"Apr 2002", count: 1076.92},
            {date:"May 2002", count: 1067.14},
            {date:"Jun 2002", count: 989.82},
            {date:"Jul 2002", count: 911.62},
            {date:"Aug 2002", count: 916.07},
            {date:"Sep 2002", count: 815.28},
            {date:"Oct 2002", count: 885.76},
            {date:"Nov 2002", count: 936.31},
            {date:"Dec 2002", count: 879.82},
            {date:"Jan 2003", count: 855.7},
            {date:"Feb 2003", count: 841.15},
            {date:"Mar 2003", count: 848.18},
            {date:"Apr 2003", count: 916.92},
            {date:"May 2003", count: 963.59},
            {date:"Jun 2003", count: 974.5},
            {date:"Jul 2003", count: 990.31},
            {date:"Aug 2003", count: 1008.01},
            {date:"Sep 2003", count: 995.97},
            {date:"Oct 2003", count: 1050.71},
            {date:"Nov 2003", count: 1058.2},
            {date:"Dec 2003", count: 1111.92},
            {date:"Jan 2004", count: 1131.13},
            {date:"Feb 2004", count: 1144.94},
            {date:"Mar 2004", count: 1126.21},
            {date:"Apr 2004", count: 1107.3},
            {date:"May 2004", count: 1120.68},
            {date:"Jun 2004", count: 1140.84},
            {date:"Jul 2004", count: 1101.72},
            {date:"Aug 2004", count: 1104.24},
            {date:"Sep 2004", count: 1114.58},
            {date:"Oct 2004", count: 1130.2},
            {date:"Nov 2004", count: 1173.82},
            {date:"Dec 2004", count: 1211.92},
            {date:"Jan 2005", count: 1181.27},
            {date:"Feb 2005", count: 1203.6},
            {date:"Mar 2005", count: 1180.59},
            {date:"Apr 2005", count: 1156.85},
            {date:"May 2005", count: 1191.5},
            {date:"Jun 2005", count: 1191.33},
            {date:"Jul 2005", count: 1234.18},
            {date:"Aug 2005", count: 1220.33},
            {date:"Sep 2005", count: 1228.81},
            {date:"Oct 2005", count: 1207.01},
            {date:"Nov 2005", count: 1249.48},
            {date:"Dec 2005", count: 1248.29},
            {date:"Jan 2006", count: 1280.08},
            {date:"Feb 2006", count: 1280.66},
            {date:"Mar 2006", count: 1294.87},
            {date:"Apr 2006", count: 1310.61},
            {date:"May 2006", count: 1270.09},
            {date:"Jun 2006", count: 1270.2},
            {date:"Jul 2006", count: 1276.66},
            {date:"Aug 2006", count: 1303.82},
            {date:"Sep 2006", count: 1335.85},
            {date:"Oct 2006", count: 1377.94},
            {date:"Nov 2006", count: 1400.63},
            {date:"Dec 2006", count: 1418.3},
            {date:"Jan 2007", count: 1438.24},
            {date:"Feb 2007", count: 1406.82},
            {date:"Mar 2007", count: 1420.86},
            {date:"Apr 2007", count: 1482.37},
            {date:"May 2007", count: 1530.62},
            {date:"Jun 2007", count: 1503.35},
            {date:"Jul 2007", count: 1455.27},
            {date:"Aug 2007", count: 1473.99},
            {date:"Sep 2007", count: 1526.75},
            {date:"Oct 2007", count: 1549.38},
            {date:"Nov 2007", count: 1481.14},
            {date:"Dec 2007", count: 1468.36},
            {date:"Jan 2008", count: 1378.55},
            {date:"Feb 2008", count: 1330.63},
            {date:"Mar 2008", count: 1322.7},
            {date:"Apr 2008", count: 1385.59},
            {date:"May 2008", count: 1400.38},
            {date:"Jun 2008", count: 1280},
            {date:"Jul 2008", count: 1267.38},
            {date:"Aug 2008", count: 1282.83},
            {date:"Sep 2008", count: 1166.36},
            {date:"Oct 2008", count: 968.75},
            {date:"Nov 2008", count: 896.24},
            {date:"Dec 2008", count: 903.25},
            {date:"Jan 2009", count: 825.88},
            {date:"Feb 2009", count: 735.09},
            {date:"Mar 2009", count: 797.87},
            {date:"Apr 2009", count: 872.81},
            {date:"May 2009", count: 919.14},
            {date:"Jun 2009", count: 919.32},
            {date:"Jul 2009", count: 987.48},
            {date:"Aug 2009", count: 1020.62},
            {date:"Sep 2009", count: 1057.08},
            {date:"Oct 2009", count: 1036.19},
            {date:"Nov 2009", count: 1095.63},
            {date:"Dec 2009", count: 1115.1},
            {date:"Jan 2010", count: 1073.87},
            {date:"Feb 2010", count: 1104.49},
            {date:"Mar 2010", count: 1140.45}]
}

AreaChartExtent.propTypes = {
    margin: React.PropTypes.array,
    data: React.PropTypes.array
}