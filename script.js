const url =
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const margin = {
  top: 100,
  right: 20,
  bottom: 30,
  left: 60,
};
const width = 920 - margin.left - margin.right;
const height = 630 - margin.top - margin.bottom;
//
const x = d3.scaleLinear().range([0, width]);

const y = d3.scaleTime().range([0, height]);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const timeFormat = d3.timeFormat("%M:%S");
const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));

const yAxis = d3.axisLeft(y).tickFormat(timeFormat);
//
const svg = d3
  .select(".vis")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "graph")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
const tooltip = d3
  .select(".vis")
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

d3.json(url).then((data) => {
  console.log(data);

  data.forEach(function (d) {
    d.Place = +d.Place;
    var parsedTime = d.Time.split(":");
    d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  });

  x.domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)]);

  y.domain(
    d3.extent(data, function (d) {
      return d.Time;
    })
  );

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Year");

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("id", "y-axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Best Time (minutes)");

  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 6)
    .attr("fill", (d) => color(d.Doping !== ""))
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.Time))
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time.toISOString())
    .on("mouseover", (d) => {
      console.log(d);
    })
    .on("mouseover", function (event, d) {
      tooltip.style("opacity", 0.9);
      tooltip.attr("data-year", d.Year);
      tooltip
        .html(
          d.Name +
            ": " +
            d.Nationality +
            "<br/>" +
            "Year: " +
            d.Year +
            ", Time: " +
            timeFormat(d.Time) +
            (d.Doping ? "<br/><br/>" + d.Doping : "")
        )
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
    });

  // legend

  const legendContainer = svg.append("g").attr("id", "legend");

  const legend = legendContainer
    .selectAll("#legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend-label")
    .attr("transform", function (d, i) {
      return "translate(0," + (height / 2 - i * 20) + ")";
    });

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) {
      if (d) {
        return "Riders with doping allegations";
      } else {
        return "No doping allegations";
      }
    });
});
