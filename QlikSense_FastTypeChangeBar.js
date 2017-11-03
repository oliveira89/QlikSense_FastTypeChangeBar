define(["./js/echarts"], function(eCharts){
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
    support: {
      snapshot: true,
      export: true,
      exportData: true
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
          label: "Appearance",
          items: {
            myfontSettings: {
              label: "Title",
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
                }
              }
            },
            myFastTypePro: {
              label: "Fast Type Changing",
              type: "items",
              items: {
                showTable:{
                  label: "Allow Table",
                  type: "boolean",
                  defaultValue: false,
                  ref:"custom.showTable"
                },
                showBar:{
                  label: "Allow Bar Chart",
                  type: "boolean",
                  defaultValue: false,
                  ref:"custom.showBar"
                },
                showLine:{
                  label: "Allow Line Chart",
                  type: "boolean",
                  defaultValue: false,
                  ref:"custom.showLine"
                },
                showRestore:{
                  label: "Allow Restore to Original",
                  type: "boolean",
                  defaultValue: false,
                  ref:"custom.showRestore"
                },
                showSave:{
                  label: "Allow Save Chart to Image",
                  type: "boolean",
                  defaultValue: false,
                  ref:"custom.showSave"
                }
              }
            },
            myColourSettings: {
              label: "Colour",
              type: "items",
              items: {
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
      $scope.eBarChart = eCharts.init($element[0]);
      $scope.eBarChart.on("click", function(item){
        var elemNumber = item.data.qElemNumber;
        $scope.backendApi.selectValues(0, [elemNumber], true);
      });
    },
    resize: function($scope){
      this.$scope.eBarChart.resize();
    },
    paint: function($element, layout){
      var xData = [];
      var yData = [];
      var fastType = [];
      var todayDate = new Date(Date.now());
      var matrix = layout.qHyperCube.qDataPages[0].qMatrix;

      if (layout.custom.showBar) {
        fastType.push('bar');
      };
      if (layout.custom.showLine) {
        fastType.push('line');
      };

      for (var i = 0; i < matrix.length; i++) {
        xData.push({
          value: matrix[i][0].qText
        });
        yData.push({
          value: matrix[i][1].qNum,
          qElemNumber: matrix[i][0].qElemNumber
        });
      };

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
      }],
      toolbox: {
          show: true,
          feature: {
          dataZoom: {
                yAxisIndex: false,
                title:{
                    zoom: 'Multi Data Zoom',
                    back: 'Back'
                }
            },
            dataView: {
                show: layout.custom.showTable,
                title: 'View data in Table',
                readOnly: true,
                lang: ['Chart Raw Data', 'Return to Chart']
            },
            magicType: {
              type: fastType,
              title: {
                line: 'Change to Line Chart',
                bar: 'Change to Bar Chart'
              }
            },
            restore: {
              show: layout.custom.showRestore,
              title: 'Restore Chart',
            },
            saveAsImage: {
              show: layout.custom.showSave,
              title: 'Save Chart as Image',
              type: 'jpeg',
              name: ''
            },
          }
        }
      };
      option.toolbox.feature.saveAsImage.name = option.title.text + ' ' + todayDate;
      this.$scope.eBarChart.setOption(option);
    }
  }
})
