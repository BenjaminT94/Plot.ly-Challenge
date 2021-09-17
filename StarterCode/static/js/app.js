function Metadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
    //   Utilizing the arrow method to call on the filter function
    // Use sample_values as the values for the bar chart
      var array= metadata.filter(sampleobject => sampleobject.id == sample);
      var result= array[0]
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
      });
    });
  }


function VariousCharts(sample) {


  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var array= samples.filter(sampleobject => sampleobject.id == sample);
    var result= array[0]
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
    // Build the Bubble Chart with Plotly
    var Layout = {
      margin: { t: 0 },
      xaxis: { title: "Id's" },
      hovermode: "closest",
      };

      var Data = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];

    Plotly.plot("bubble", Data, Layout);

    //  Build the Bar Chart with Plotly
    
    var bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"

      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", bar_data, barLayout);
  });
}
   
 
function init() {
  // Creating the dropdown element
  var selector = d3.select("#selDataset");

  // Creating the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Building the initial plots
    const firstSample = sampleNames[0];
    VariousCharts(firstSample);
    Metadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Retrieve new data every time a new sample is chosen
  VariousCharts(newSample);
  Metadata(newSample);
}

// Initializing
init();