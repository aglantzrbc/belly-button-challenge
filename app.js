// Use the D3 library to read in samples.json from the URL below
const jsonFile = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Build function that populates the demographics box on the left side of the page
function buildInfoBox(sample) {
    // Use d3.json in order to get all of the data from the json file and then use the arrow function to pass in the data
    d3.json(jsonFile).then((data) => {
        // Get all of the metadata from the json file
        let metaData = data.metadata;

        // Filter based on the value of the sample (should be 1 result)
        let result = metaData.filter(sampleResult => sampleResult.id == sample);

        // Access index 0 from the array (should be 1 result)
        let resultData = result[0];

        // Clear out the incumbent metadata: this prepares the element for the new data that will be inserted
        d3.select("#sample-metadata").html("");

        // Use Object.entries to return the key:value pairs and put into the demographics box on the page using d3
        Object.entries(resultData).forEach(([key, value]) => {
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
}; // end of buildInfoBox function

// Build function that creates the bar chart in the middle of the page
function buildBarChart(sample) {
    // Use d3.json in order to get all of the data from the json file and then use the arrow function to pass in the data
    d3.json(jsonFile).then((data) => {
        // Get all of the sample data from the json file
        let sampleData = data.samples;

        // Filter based on the value of sample (should be 1 result)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // Access index 0 from the array (should be 1 result)
        let resultData = result[0];

        // Get the otu_ids, labels, and sample_values fields from the resultData
        let otu_ids = resultData.otu_ids; // otu_ids is the id of the bacteria
        let otu_labels = resultData.otu_labels; // otu_labels is the name of the bacteria
        let sample_values = resultData.sample_values; // sample_values is the amount of the bacteria present

        // Set the top 10 items to display on the bar chart
        let yTicks = otu_ids.slice(0, 10).map(id => `OTU ${id}`); // map the otu_ids to the yTicks
        let xValues = sample_values.slice(0, 10); // set the xValues to the sample_values
        let textLabels = otu_labels.slice(0, 10); // set the textLabels to the otu_labels

        // Set up the bar chart using the Plotly library with orientation set to horizontal
        let barChart = {
            y: yTicks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(), // Here, otu_labels is used for the hover text
            type: "bar",
            orientation: "h"
        };

        // Set up the layout for the bar chart with a title and adjust the margin for the left side
        let layout = {
            title: "Top 10 Belly Button Bacteria",
            yaxis: {
                title: "Bacteria OTU ID",
                automargin: true, 
                ticklen: 10, 
                tickfont: {
                    size: 12 
                }
            },
            xaxis: {
                title: "Sample Volume"
            }
        };

        // Call Plotly to plot the bar chart on the page
        Plotly.newPlot("bar", [barChart], layout);
    });
}; // end of buildBarChart function

// Build function that creates the bubble chart on the bottom of the page
function buildBubbleChart(sample) {
    // Use d3.json in order to get all of the data from the json file and then use the arrow function to pass in the data
    d3.json(jsonFile).then((data) => {
        // Get all of the sample data from the json file
        let sampleData = data.samples;

        // Filter based on the value of sample (should be 1 result)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // Access index 0 from the array (should be 1 result)
        let resultData = result[0];

        // Get the otu_ids, labels, and sample_values fields from the resultData
        let otu_ids = resultData.otu_ids; // otu_ids is the id of the bacteria
        let otu_labels = resultData.otu_labels; // otu_labels is the name of the bacteria
        let sample_values = resultData.sample_values; // sample_values is the amount of the bacteria present

        // Set up the bubble chart using the Plotly library
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels, // Here, otu_labels is used for the hover text
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout for the bubble chart with a title and axis labels
        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID (Operational Taxonomic Unit Identifier)" },
            yaxis: { title: "Amount Present in Culture" }
        };

        // Call Plotly to plot the bubble chart on the page
        Plotly.newPlot("bubble", [bubbleChart], layout);
    });
}; // end of buildBubbleChart function

// Build function that creates the gauge chart on the right side of the page
function buildGaugeChart(sample) {
    // Use d3.json in order to get all of the data from the json file and then use the arrow function to pass in the data
    d3.json(jsonFile).then((data) => {
        // Get all of the metadata from the json file
        let metaData = data.metadata;

        // Filter based on the value of the sample (should be 1 result)
        let result = metaData.filter(sampleResult => sampleResult.id == sample);

        // Access index 0 from the array (should be 1 result)
        let resultData = result[0];

        // Get the washing frequency from the resultData
        let washFrequency = Object.values(resultData)[6];

        // Calculate the degrees for the dial pointer based on the washing frequency
        let degrees = 180 - (washFrequency * 20), // Adjust the multiplier based on the data range
            radius = 0.6;
        let radians = degrees * Math.PI / 180;
        let x = radius * Math.cos(radians);
        let y = radius * Math.sin(radians);

        // Set up the path for the dial pointer
        let mainPath = 'M -.0 -0.035 L .0 0.035 L ',
            cX = String(x),
            cY = String(y),
            pathEnd = ' Z';
        let path = mainPath + cX + " " + cY + pathEnd;

        // Set up the layout for the gauge chart
        let gaugeLayout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: 'red',
                line: {
                    color: 'red'
                }
            }],
            title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
            xaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] },
            yaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] }
        };

        // Set up the data for the gauge chart
        let gaugeData = [{
            type: 'scatter',
            x: [0],
            y: [0],
            marker: { size: 12, color: 'red' },
            showlegend: false,
            name: 'Freq',
            text: washFrequency,
            hoverinfo: 'text+name'
        },
        {
            values: [50 / 6, 50 / 6, 50 / 6, 50 / 6, 50 / 6, 50 / 6, 50],
            rotation: 90,
            text: ['8-9', '6-7', '4-5', '2-3', '1-2', '0-1', ''], // Adjust the text to match the range of the data
            textinfo: 'text',
            textposition: 'inside',
            marker: {
                colors: ['rgba(0, 105, 11, .5)', 'rgba(10, 120, 22, .5)',
                    'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                    'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                    'rgba(255, 255, 255, 0)']
            },
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
            hoverinfo: 'label',
            hole: 0.5,
            type: 'pie',
            showlegend: false
        }]; // end of gaugeData

        // Call Plotly to plot the gauge chart on the page
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
}; // end of buildGaugeChart function

// Build function that initializes the dashboard at start up with the first sample
function initialize() {
    // Access the dropdown selector from the index.html file and assign it to a variable
    var select = d3.select("#selDataset");

    // Use d3.json in order to get the sample names and populate the drop-down selector with the sample names
    d3.json(jsonFile).then((data) => {
        let sampleNames = data.names;
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });
        // Pass in the information for the first sample when the page loads
        let sample1 = sampleNames[0];

        // Call the function to build the initial demographics box on the left side of the page
        buildInfoBox(sample1);

        // Call the function to build the initial bar chart in the middle of the page
        buildBarChart(sample1);

        // Call the function to build the initial bubble chart on the bottom of the page
        buildBubbleChart(sample1);

        // Call the function to build the initial gauge chart on the right side of the page
        buildGaugeChart(sample1);
    }); // end of d3.json
};

// Build function that updates the dashboard when a new sample is selected from the drop-down selector
function optionChanged(item) {
    // Call the function to build the demographics box on the left side of the page
    buildInfoBox(item);

    // Call the function to build the bar chart in the middle of the page
    buildBarChart(item);

    // Call the function to build the bubble chart on the bottom of the page
    buildBubbleChart(item);

    // Call the function to build the gauge chart on the right side of the page
    buildGaugeChart(item);
} // end of optionChanged function

// Call the initialize function to start the dashboard
initialize(); // end of initialize function