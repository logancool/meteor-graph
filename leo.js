// code to run on server at startup
Choices = new Mongo.Collection("choices");
Choices.insert({choice: "Yes", count: 3});
Choices.insert({choice: "No", count: 1});
var myDoughnutChart;
var datasets;

if (Meteor.isClient) {

  Template.charts.helpers({
    yesCount: function () {
      return Choices.findOne({choice:'Yes'}).count;
    },
    noCount: function() {
      return Choices.findOne({choice:'No'}).count;
    }
  });



  Template.charts.onRendered(function() {
    // Get the context of the canvas element we want to select
    var ctx  = document.getElementById("choiceChart").getContext("2d");
    datasets = [
      {
        value: yesVal(),
        color: "#00FF00"
      },
      {
        value: noVal(),
        color:"#ff0000",
      }
    ]

    // draw the chart
    // And for a doughnut chart
      myDoughnutChart = new Chart(ctx).Doughnut(datasets,{
      animateScale: true
    });
  });

  Template.buttons.events({
    'click #yes': function () {
      Choices.update({_id:Choices.findOne({choice:'Yes'})['_id']}, {$inc:{count: 1}});
      myDoughnutChart.segments[0].value = Choices.findOne({choice:'Yes'}).count;
      console.log(Choices.findOne({choice:'Yes'}).count);
      myDoughnutChart.update();
    },
    'click #no': function () {
      // increment the counter when button is clicked
      Choices.update({_id:Choices.findOne({choice:'No'})['_id']}, {$inc:{count: 1}});
      myDoughnutChart.segments[1].value = Choices.findOne({choice:'No'}).count;
      console.log(Choices.findOne({choice:'No'}).count);
      myDoughnutChart.update();
    },
  });

  function yesVal() {

      return Choices.findOne({choice:'Yes'}).count;
    }
  function noVal() {
    console.log(Choices.findOne({choice:'No'}).count);
      return Choices.findOne({choice:'No'}).count;
    }
}

if (Meteor.isServer) {

}
