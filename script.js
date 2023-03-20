
const fetchData = () => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(dataset => {
        renderData(dataset.data);
    })
}

const renderData = (dataset) => {
    const w = 1250;
    const h = 800;
    const padding = 60;
    const barWidth = w / dataset.length;

    const dates = dataset.map((item) => {
        return new Date(item[0])
    })

    const xScale = d3.scaleTime()
                        .domain([d3.min(dates), d3.max(dates)])
                        .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset, (d) => d[1])])
                        .range([h - padding, padding]);

    const svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    const gdpData = dataset.map((item) => yScale(item[1]))

    let tooltip = d3.select("#chart-area").append("div")
        .attr("id", "tooltip")
        .style("position", 'absolute')
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border-radius", "5px")
        .style("border", "1px solid black")
        .style("height", "100px")
        .style("width", "200px")

    svg.selectAll("rect")
        .data(gdpData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(dates[i]))
        .attr("y",(d) => d)
        .attr('width', barWidth)
        .attr('height', (d) => h - d - padding)
        .attr("fill", 'green')
        .attr('class', 'bar')
        .attr('data-date', (d, i) => dataset[i][0])
        .attr('data-gdp', (d, i) => dataset[i][1])
        .attr('data-index', (d, i) => i)
        .on('mouseover', (e, d) => {
            let index = e.target.dataset.index
            tooltip
                .attr('data-date', (d, i) => dataset[index][0])
                .style("left", e.clientX - 100 + "px")		
                .style("top", e.clientY - 100 + "px")
                .html("<p><strong>" + dates[index].toLocaleDateString() +"</strong><p>GDP: $"+ dataset[index][1] + " Billion" )
                .transition()
                .duration(200)		
                .style("opacity", .9)
               
                
        })
        .on("mouseout", (d, i) => {
            tooltip.transition()
                    .duration(200)
                    .style("opacity", 0)
        })
            
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr('id', 'x-axis')
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + (padding) + ", 0)")
        .attr('id', 'y-axis')
        .call(yAxis);

}

fetchData();
