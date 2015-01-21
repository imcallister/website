d3.efie.lines = function module() {
    var margin = {top: 20, right: 50, bottom: 30, left: 60},
        width = 750,
        height = 500;
    var svg;
    var ch_legend;
    var y_ax_label;
    var xScale = d3.time.scale();
    var line_cnt = 2;
    var y_domain;

    function exports(_selection) {
        _selection.each(function (_data) {
            var chartW = width - margin.left - margin.right,
                chartH = height - margin.top - margin.bottom;
        
            xScale.range([0, chartW])
                    .domain(d3.extent(_data, function(d) { return d[0]; }));

            var yScale = d3.scale.linear().range([chartH, 0]);

            if (!y_domain) {
                if (line_cnt==2) {
                    yScale.domain([d3.min(_data, function(d) { return Math.min(d[1], d[2]); }),
                                        d3.max(_data, function(d) { return Math.max(d[1], d[2]); })]);
                    function Y1(d) { return yScale(+d[2]);}
                }
                else {
                    yScale.domain([d3.min(_data, function(d) { return d[1]; }),
                                        d3.max(_data, function(d) { return d[1]; })]);    
                }
            }
            else {
                yScale.domain(y_domain);
            }

            function X(d) { return xScale(d[0]);}
            function Y0(d) { return yScale(+d[1]);}
            

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(10, ".2s");

            var svg = d3.select(this).append("svg").data([_data]);
            
            var line0 = d3.svg.line().x(X).y(Y0);
            if (line_cnt == 2) {
                var line1 = d3.svg.line().x(X).y(Y1);
            }
                
            var svg = svg.attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(y_ax_label);


            svg.append("path")
                .datum(_data)
                .attr("class", "line0")
                .attr("data-legend",function(d) { return 'Buys'})
                .attr("d", line0);

            if (line_cnt==2) {
                svg.append("path")
                    .datum(_data)
                    .attr("class", "line1")
                    .attr("data-legend",function(d) { return 'Sells'})
                    .attr("d", line1);
            }

            var legend = svg.append("g")
                .attr("class","legend")
                .attr("transform","translate(100,30)")
                .style("font-size","12px")
                .call(ch_legend);

        });
    }

    exports.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return;
    };

    exports.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return ;
    };

    exports.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return;
    };

    exports.domain1 = function(_) {
        if (!arguments.length) return domain1;
        domain1 = _;
        return;
    };

    exports.line_cnt = function(_) {
        if (!arguments.length) return line_cnt;
        line_cnt = _;
        return;
    };

    exports.xScale = function(_) {
        if (!arguments.length) return xScale;
        xScale = _;
        return;
    };

    exports.y_ax_label = function(_) {
        if (!arguments.length) return y_ax_label;
        y_ax_label = _;
        return;
    };

    exports.y_domain = function(_) {
        if (!arguments.length) return y_domain;
        y_domain = _;
        return;
    };

    exports.mylegend = function(_) {
        if (!arguments.length) return ch_legend;
        ch_legend = _;
        return;
    };

    return exports;
}

