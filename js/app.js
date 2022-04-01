const samples = '/data/samples.json'

d3.json(samples).then((dataSet) => {

  console.log(dataSet);

  var data = dataSet;
  var names = data.names;

  //add name to dropdown
  names.forEach((name, n) => {
    d3.select('#selDataset').append('option').text(name);
  });

  // initialize plots

  function init() {

  		// Get initial test data
  		initialIDData = data.samples.filter(sample => sample.id === "940")[0];
  		//console.log(initialIDData);

  		// Get sample values, OTU IDs and labels
  		sampleValuesAll = initialIDData.sample_values;
  		otuIdsAll = initialIDData.otu_ids;
  		otuLabelsAll = initialIDData.otu_labels;

  		// Top 10 OTU samples, IDs, and Labels
  		topSampleValues = sampleValuesAll.slice(0, 10).reverse();
  		topOtuIds = otuIdsAll.slice(0, 10).reverse();
  		topOtuLabels = otuLabelsAll.slice(0, 10).reverse();
  		// console.log(topSampleValues);
  		// console.log(topOtuIds);
  		// console.log(topOtuLabels);

      // plot bar chart

      let barTrace = {
        x: topSampleValues,
        y: topOtuIds,
        text: topOtuLabels,
        type: 'bar',
        orientation: 'h',
      };

      let barPlotData = [barTrace];

      let barPlotLayout = {
        title: 'Top 10 OTUs',
        xaxis: {title: 'Sample Value'},
        yaxis: {title: 'OTU ID', type: 'category'},
        autosize: true,
        width: 800,
        height: 500,
      };

      Plotly.newPlot('bar', barPlotData, barPlotLayout);

      // plot bubble_chart

      let bubbleData = {
        x: otuIdsAll,
        y: sampleValuesAll,
        text: topOtuLabels,
        mode: 'markers',
        marker: {
          color: otuIdsAll,
          size: sampleValuesAll,
        },
      }

      let bublePlot = [bubbleData];

      let bubblePlotLayout = {
        title: 'OTU samples',
        xaxis: {title: 'OTU ID'},
        yaxis: {title: 'Sample Value'},
        showlegend: false,
      }

      Plotly.newPlot('bubble', bublePlot, bubblePlotLayout)


  };


  init();

});
