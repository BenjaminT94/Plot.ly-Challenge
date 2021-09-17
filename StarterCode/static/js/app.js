function Metadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
    //   Utilizing the arrow method to call on the filter function
    // Use sample_values as the values for the bar chart
      var array= metadata.filter(samplevalue => samplevalue.id == sample);
      var result= array[0]
      var selectsample = d3.select("#sample-metadata");
      selectsample.html("");
      Object.entries(result).forEach(([key, value]) => {
        selectsample.append("h6").text(`${key}: ${value}`);
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
        // Use otu_ids for the x values
        x: ids,
        // Use sample_values for the y values, in this case the values are already filtered from sample
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          // Use otu_ids for the marker colors
          color: ids,
          // Use sample_values for the marker size
          size: values,
          }
      }
    ];

    Plotly.plot("bubble", Data, Layout);

    //  Build the Bar Chart with Plotly
    
    var bar_data =[
      {
        // Use otu_ids as the labels for the bar chart
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
  var menu = d3.select("#selDataset");

  // Creating the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      menu
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Building the initial plots
    const Sample = sampleNames[0];
    VariousCharts(Sample);
    Metadata(Sample);
  });
}

function optionChanged(newSample) {
  // Retrieve new data every time a new sample is chosen
  VariousCharts(newSample);
  Metadata(newSample);
}

// Initializing
init();