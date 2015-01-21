

require(['javascripts/barChart'], function (barChart) {
	d3.efie = {};

	var vols_bar = d3.efie.barChart();
	console.log(vols_bar);
	vols_bar.width(750);
	vols_bar.height(350);
	vols_bar.y_ax_label('Volume');
	vols_bar.y_ax2_label('Trade Count');
	vols_bar.mylegend(d3.legend);
	d3.csv("data/bucket_vols_mongo.csv", function(data) {
	    data = data.map(function (d, i) {
	        return [d.TradeSize, +d.Volumes, +d.TradeCount];
	    });
	    d3.select("#vols_bar")
	            .datum(data)
	            .call(vols_bar);
	});

});