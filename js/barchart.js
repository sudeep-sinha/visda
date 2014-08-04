var vd = {
    barchart: function (selector, dataSource) {
        "use strict";

        
        var width = 420,
            barHeight = 20,
            barchart = d3.select(selector),
            data, x;

        if (typeof dataSource != "string") {
            data = dataSource;
        }

        x = d3.scale.linear()
            .range([0, 100]);

        switch (data && barchart.size() && barchart.node().nodeName.toLowerCase()) {

        case "div":
            renderHTML(barchart, data, x);
            break;

        case "svg":
            renderSVG(barchart, data, x);
            break;
        }

        if (!data && barchart.size()) {
            d3.tsv(dataSource, type, renderFromFile);
        }

        function renderHTML(barchart, data, scale) {
            scale.domain([0, d3.max(data)]);
            barchart.selectAll("div")
                .data(data)
                .enter().append("div")
                .style("width", function (d) {
                    return scale(d) + "%";
                })
                .text(function (d) {
                    return d;
                });
        }

        function renderSVG(barchart, data, scale) {
            var bar;

            scale.domain([0, d3.max(data)]);
            barchart
                .attr("width", width)
                .attr("height", barHeight * data.length);

            bar = barchart.selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * barHeight + ")";
                });

            bar.append("rect")
                .attr("width", scale)
                .attr("height", barHeight - 1);

            bar.append("text")
                .attr("x", function (d) {
                    return scale(d) - 3;
                })
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function (d) {
                    return d;
                });
        }

        function renderFromFile(error, rows) {
            
            var width = 420,
                barHeight = 20,
                x = d3.scale.linear()
                .range([0, width]),
                bar;

            x.domain([0, d3.max(rows, function (d) {
                return d.value;
            })]);

            barchart
                .attr("width", width)
                .attr("height", barHeight * rows.length);

            bar = barchart.selectAll("g")
                .data(rows)
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * barHeight + ")";
                });

            bar.append("rect")
                .attr("width", function (d) {
                    return x(d.value);
                })
                .attr("height", barHeight - 1);

            bar.append("text")
                .attr("x", function (d) {
                    return x(d.value) - 3;
                })
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function (d) {
                    return d.name + " " + d.value;
                });
        }

        function type(d) {
            d.value = +d.value; // coerce to number
            return d;
        }
    }
};

var data = [4, 8, 15, 16, 23, 42];
vd.barchart("#chart", data);
vd.barchart("#chart-svg", data);
vd.barchart("#chart-tsv", "../files/data.tsv");