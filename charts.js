function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter((sampleObj) => sampleObj.id == sample);
    //  Create a variable that holds the first sample in the array.
    var result = resultArray[0]

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var sample_values = result.sample_values
    var otu_labels = result.otu_labels
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
    var washFreq = result.wfreq
    var wFreqFloat = parseFloat(washFreq).toFixed(2)
    console.log(otu_ids)
    console.log(sample_values)
    console.log(otu_labels)
    console.log(washFreq)

    var yticks = otu_ids.slice(0, 10).map(id => {
      return 'otu ' + id;}).reverse();
  
    var bar_trace = [
      {
        x: sample_values.slice(0, 10).reverse(),  
        y: yticks,
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
      }
      ];
    // Create the trace for the bubble chart.
    var bubble_trace = [
      {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        text: otu_labels,
        marker: {
          size: sample_values,
          color: otu_ids,
        },
      },
    ];
    var gaugeData = [
      {
        value: wFreqFloat,
        title: {
          text: 'Belly Button Washing Frequency<br>Scrubs per Week',
        },
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
          axis: { range: [null, 10], dtick: 2, tick0: 0 },
          bar: { color: "darkblue" },
          steps: [
            { range: [0, 2], color: "whitesmoke"},
            { range: [2, 4], color: "lightgrey"},
            { range: [4, 6], color: "silver"},
            { range: [6, 8], color: "darkgray" },
            { range: [8, 10], color: "dimgray" },
          ]
        },
      },
    ];  
    var bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
 
    };
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
    };
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', bar_trace, bar_layout)
    Plotly.newPlot('bubble', bubble_trace, bubbleLayout);
    Plotly.newPlot('gauge', gaugeData, layout);
  });
}