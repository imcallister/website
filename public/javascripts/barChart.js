d3.efie.barChart = function module() {
    var margin = {top: 20, right: 50, bottom: 30, left: 60},
        width = 650,
        height = 350;
    var svg;
    var ch_legend;
    var y_ax_label;
    var y_ax2_label;

    function exports(_selection) {
        _selection.each(function (_data) {
            var chartW = width - margin.left - margin.right,
                chartH = height - margin.top - margin.bottom;

            var xScale = d3.scale.ordinal()
                            .rangeRoundBands([0, chartW], .1)
                            .domain(_data.map(function(d) { return d[0]; }));
            var yScale0 = d3.scale.linear()
                            .range([chartH, 0])
                            .domain([0, d3.max(_data, function(d) { return +d[1]; })]);
            var yScale1 = d3.scale.linear()
                            .range([chartH, 0])
                            .domain([0, d3.max(_data, function(d) { return +d[2]; })]);

            function X(d) {
                return xScale(d[0]);
            }

            function Y0(d) {
                return yScale0(+d[1]);
            }

            function Y1(d) {
                return yScale1(+d[2]);
            }

            var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");

            var yAxisLeft = d3.svg.axis()
                            .scale(yScale0)
                            .orient("left")
                            .ticks(10, ".2s");

            var yAxisRight = d3.svg.axis()
                                .scale(yScale1)
                                .orient("right")
                                .ticks(10, ".2s");

            var svg = d3.select(this).append("svg").data([_data]);

            var svg = svg.attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + chartH + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxisLeft)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(y_ax_label);

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + chartW + " ,0)")
                .call(yAxisRight)
                .append("text")
                .attr("y", -margin.right / 3)
                .attr("transform", "rotate(-90)")
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(y_ax2_label);

            //svg.attr("width", width + margin.left + margin.right)
            //    .attr("height", height + margin.top + margin.bottom);
            //var g = svg.select("g")
            //    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.selectAll(".bar")
                .data(_data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("data-legend", function (d) {
                    return 'Volumes'
                })
                .attr("x", X)
                .attr("y", Y0)
                .attr("width", xScale.rangeBand()/2)
                .attr("height", function (d) {
                    return chartH - Y0(d);
                });


            svg.selectAll(".bar2")
                .data(_data)
                .enter()
                .append("rect")
                .attr("class", "bar2")
                .attr("data-legend", function (d) {return 'Count' })
                .attr("x", function(d) {return X(d) + xScale.rangeBand()/2} )
                .attr("width", xScale.rangeBand()/2)
                .attr("y", Y1)
                .attr("height", function (d) {
                    return chartH - Y1(d);
                });

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
        return;
    };

    exports.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return;
    };

    exports.y_ax_label = function(_) {
        if (!arguments.length) return y_ax_label;
        y_ax_label = _;
        return;
    };

    exports.y_ax2_label = function(_) {
        if (!arguments.length) return y_ax2_label;
        y_ax2_label = _;
        return;
    };

    exports.mylegend = function(_) {
        if (!arguments.length) return ch_legend;
        ch_legend = _;
        return;
    };

    // not working... gets confused

    /*
    exports.x = function(_) {
        if (!arguments.length) return xValue_bar;
        xValue_bar = _;
        return barChart;
    };

    exports.y0 = function(_) {
        if (!arguments.length) return yValue0_bar;
        yValue0_bar = _;
        return barChart;
    };

    exports.y1 = function(_) {
        if (!arguments.length) return yValue1_bar;
        yValue1_bar = _;
        return barChart;
    };
    */
    
    // working but ugly

    /*
    barChart.xbarchart = function(_) {
        if (!arguments.length) return xValue_bar;
        xValue_bar = _;
        return barChart;
    };

    barChart.y0barchart = function(_) {
        if (!arguments.length) return yValue0_bar;
        yValue0_bar = _;
        return barChart;
    };

    barChart.y1barchart = function(_) {
        if (!arguments.length) return yValue1_bar;
        yValue1_bar = _;
        return barChart;
    };

    

    exports.mylegend = function(_) {
        if (!arguments.length) return ch_legend;
        ch_legend = _;
        return barChart;
    };

    function type(d) {
        d.Volumes = +d.Volumes;
        d.TradeCount = +d.TradeCount;
        return d;
    }

    */  
    return exports;

}




