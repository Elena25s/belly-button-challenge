// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(obj => obj.id === parseInt(sample))[0];


    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    panel.html("");


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value])=>{ 
      panel.append("p").text(`${key.toUpperCase()}: ${value}`)

    });

  });
}

buildMetadata("940")
// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number

    let result = samples.filter(obj => obj.id === sample)[0];
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values

    // Build a Bar Chart
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let xvals = sample_values.slice(0, 10).reverse();
    let labels = otu_labels.slice(0, 10).reverse();

    let barData = [{
      x: xvals,
      y: yticks,
      text: labels,
      type : "bar",
      orientation: "h"
    }]

    let barlayout = {
      margin: {t:30, l: 100}
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barlayout)

    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }]

    let bubbleLayout = {  
      xaxis: { title: "OTU ID" },
      yaxis: {title:"Number of Bacteria"},
      hovermode: "closest",
      margin: {t: 50 }
    };

    // Render the Bubble Chart

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });
}
buildCharts("940");
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;
    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    // Build charts and metadata panel with the first sample
    let firstSample = sampleNames[0];
      buildMetadata(firstSample);
      buildCharts(firstSample);

  });
}


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Initialize the dashboard
init();
