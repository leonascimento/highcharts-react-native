const hcUtils = {
  // convert string to JSON, including functions.
  parseOptions: function (chartOptions) {
      const parseFunction = this.parseFunction;

      var options = JSON.parse(chartOptions, function (val, key) {
          if (typeof key === 'string' && key.indexOf('function') > -1) {
              return parseFunction(key);
          } else {
              return key;
          }
      });

      return options;
  },
  // convert funtion string to function
  parseFunction: function (fc) {

      var fcArgs = fc.match(/\((.*?)\)/)[1],
          fcbody = fc.split('{');

      return new Function(fcArgs, '{' + fcbody.slice(1).join('{'));
  }
};

// Communication between React app and webview. Receive chart options as string.
document.addEventListener('message', function (event) {
  const payload = JSON.parse(event.data);
  // Be able to apply different kind of actions
  if (payload && payload.command === 'applyZoom') {
      Highcharts.charts[0].xAxis[0].setExtremes(payload.min, payload.max, true, true);
  }
  if (payload && payload.command === 'updateSerie' && Highcharts) {
      const curvesKeys = {
         0: 'totalGas',
         1: 'wetness',
         2: 'rop',
         3: 'ballanceRatio',
         4: 'wob',
      };
      for(let i = 0; i <= 4; i++) {
          const currentCurveName = curvesKeys[i];
          Highcharts.charts[0].series[i].update({
                  data: payload.data[currentCurveName],
              },
              true,
              true
          );
      }
  }
});