const samples = '/data/samples.json'

d3.json(samples).then((dataSet) => {

  console.log(dataSet);

  let data = dataSet;
  let names = data.names;

  var nameID = '940'

  //add name to dropdown
  names.forEach((name, n) => {
    d3.select('#selDataset').append('option').text(name);
  });

  // initialize plots

  function init() {

  		// Get initial test data
  		idData = data.samples.filter(sample => sample.id === nameID)[0];

      // Render demographic details
      demographics = data.metadata.filter(sample => sample.id == nameID)[0];
      console.log(demographics);
      Object.entries(demographics).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));


  		// Get sample values, OTU IDs and labels
  		sampleValuesAll = idData.sample_values;
  		otuIdsAll = idData.otu_ids;
  		otuLabelsAll = idData.otu_labels;

  		// Top 10 OTU samples, IDs, and Labels
  		topSampleValues = sampleValuesAll.slice(0, 10).reverse();
  		topOtuIds = otuIdsAll.slice(0, 10).reverse();
  		topOtuLabels = otuLabelsAll.slice(0, 10).reverse();

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

      // plot guage

      var washFrequence = demographics.wfreq;

      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washFrequence,
          title: {text: 'Belly Button Washing Frequency (Scrubs per week)'},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: 'rgb(248, 243, 236)' },
              { range: [1, 2], color: 'rgb(244, 241, 229)' },
              { range: [2, 3], color: 'rgb(233, 230, 202)' },
              { range: [3, 4], color: 'rgb(229, 231, 179)' },
              { range: [4, 5], color: 'rgb(213, 228, 157)' },
              { range: [5, 6], color: 'rgb(183, 204, 146)' },
              { range: [6, 7], color: 'rgb(140, 191, 136)' },
              { range: [7, 8], color: 'rgb(138, 187, 143)' },
              { range: [8, 9], color: 'rgb(133, 180, 138)' },
            ],
          }
        }
      ];

      var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

      Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  };

  d3.selectAll('#selDataset').on('change', updatePlotly)

  function updatePlotly() {
    let dropdownMenu = d3.select('#selDataset');
    let nameID = dropdownMenu.property('value');

    // Get initial test data
    idData = data.samples.filter(sample => sample.id === nameID)[0];
    //console.log(idData);

    // Get sample values, OTU IDs and labels
    sampleValuesAll = idData.sample_values;
    otuIdsAll = idData.otu_ids;
    otuLabelsAll = idData.otu_labels;

    // Top 10 OTU samples, IDs, and Labels
    topSampleValues = sampleValuesAll.slice(0, 10).reverse();
    topOtuIds = otuIdsAll.slice(0, 10).reverse();
    topOtuLabels = otuLabelsAll.slice(0, 10).reverse();

    // Update plots
    Plotly.restyle('bar', 'x', [topSampleValues]);
		Plotly.restyle("bar", "y", [topOtuIds.map(otuID => `OTU ${otuID}`)]);
    Plotly.restyle('bar', 'text', [topOtuLabels]);
    Plotly.restyle('bar', 'text', [topOtuLabels]);

    Plotly.restyle('bubble', "x", [otuIdsAll]);
		Plotly.restyle('bubble', "y", [sampleValuesAll]);
		Plotly.restyle('bubble', "text", [otuLabelsAll]);
		Plotly.restyle('bubble', "marker.color", [otuIdsAll]);
		Plotly.restyle('bubble', "marker.size", [sampleValuesAll]);

    // update demographic information
		demographics = data.metadata.filter(sample => sample.id == nameID)[0];
		d3.select("#sample-metadata").html("");
		Object.entries(demographics).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

    var washFrequence = demographics.wfreq;
    Plotly.restyle('gauge', "value", washFrequence);

  };

  init();


});
