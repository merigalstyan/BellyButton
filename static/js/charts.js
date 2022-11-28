function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samplesforcharts.json").then((data) => {
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
  d3.json("samplesforcharts.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var result = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samplesforcharts.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let filteredSample = samples.filter(sampleInfo => sampleInfo.id == sample)[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = filteredSample.otu_ids;
    let otu_labels = filteredSample.otu_labels;
    let sample_values = filteredSample.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse()
    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: sample_values.slice(0,10).reverse(),
        y: yticks,
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {color: sample_values.slice(0,10).reverse(),
        colorscale: 'bugn'}
      }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      font: {
        family: "Courier New, monospace",
        size: 13,
        color: "rgb(92, 64, 51)"},
        margin: {b:20},
        paper_bgcolor: "rgb(254, 241, 232)",
        plot_bgcolor: "rgb(254, 241, 232)"
    };
    // 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", barData, barLayout);


    var bubbleData = [ {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {color: otu_ids,
      size: sample_values,
      colorscale: 'bugn'
    }
  }
    ];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false,
      margin: {t:100 , l: 70, b: 35, r: 20},
      hovermode: "closest",
      font: {
        family: "Courier New, monospace",
        size: 14,
        color: "rgb(92, 64, 51)"},
        paper_bgcolor: "rgb(254, 241, 232)",
        plot_bgcolor: "rgb(254, 241, 232)"
    }
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 3. Create a variable that holds the washing frequency.
    let metadata = data.metadata;
    let filteredMetadata = metadata.filter(metaInfo => metaInfo.id == sample)[0];
    let washFrequency = parseFloat(filteredMetadata.wfreq);

    let gaugeTrace = [
      {domain: { x: [0, 1], y: [0, 1] },
      value: washFrequency,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "Washing Frequency per Week"},
      gauge: {
        bar: {color: 'rgb(128, 128, 0)'},
        axis: {range: [null,9]},
        steps: [
          {range:[0, 3], color: "rgb(234, 221, 202)"},
          {range:[3,6], color: "rgb(238, 232, 170)"},
          {range: [6,9], color: "rgb(242, 210, 189)"}]}
        }]
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 550, height: 450, margin: {t: 0, b:0},
      font: {
        family: "Courier New, monospace",
        size: 16,
        color: "rgb(92, 64, 51)"},
        margin: {b: 20},
        paper_bgcolor: "rgb(254, 241, 232)",
        plot_bgcolor: "rgb(254, 241, 232)"
    };
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeTrace, gaugeLayout);
  });
}