define(["./echarts"], function(echarts){
  return {
    initialProperties: {
      qHyperCubeDef: {
        qInitialDataFetch: [{
          qTop:0,
          qLeft:0,
          qWidth:2,
          qHeight:5000
        }]
      }
    },
    definition:{
      component: "accordion",
      type: "items",
      items: {
        dimensions: {
          uses: "dimensions",
          min: 1,
          max: 1
        },
        measures: {
          uses: "measures",
          min: 1,
          max: 1
        },
        sorting: {
          uses: "sorting"
        },
        myProps: {
          component: "expandable-items",
          type: "items",
          label: "My Properties",
          items: {
            myfontSettings: {
              label: "Properties",
              type: "items",
              items: {
                showTitle:{
                  label: "Show Title",
                  type: "boolean",
                  defaultValue: false,
                  ref:"custom.showTitle"
                },
                title:{
                  label: "Title",
                  type: "string",
                  ref:"custom.title"
                },
                colour:{
                  label: "Colour",
                  type: "object",
                  dualOutput: true,
                  component: "color-picker",
                  ref:"custom.colour",
                  defaultValue: {
                    "color":"#46c646",
                    "index":-1
                  },
                }
              }
            }
          }
        }
      }
    },
    controller: function($scope, $element){
      $scope.eBarChart= echarts.init($element[0]);
    },
    resize: function($scope){
      this.$scope.eBarChart.resize();
    },
    paint: function($element, layout){
      var xData = [];
      var yData = [];
      var matrix = layout.qHyperCube.qDataPages[0].qMatrix;
      matrix.forEach(function(row){
        xData.push({
          value: row[0].qText
        });
        yData.push({
          value: row[1].qNum
        });
      })
      var option = {
        title:  {
          show: layout.custom.showTitle,
          text: layout.custom.title
        },
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [{
          type: 'bar',
          data: yData,
          animation: true,
          color: [layout.custom.colour.color]
        }]
      };
      this.$scope.eBarChart.setOption(option);
    }
  }
})
