const samples = '/data/samples.json'

d3.json(samples).then((dataSet) => {

  console.log(dataSet);

  var data = dataSet;
  var names = data.names;

  //add name to dropdown
  names.forEach((name, n) => {
    d3.select('#selDataset').append('option').text(name);
  });

});
