// code to run on server at startup
Choices = new Mongo.Collection("choices");
Choices.insert({choice: "Yes", count: 3});
Choices.insert({choice: "No", count: 1});
var myDoughnutChart;
var datasets, ctx;

if (Meteor.isClient) {

  Template.charts.onRendered(function() {
    // Get the context of the canvas element we want to select
    ctx  = document.getElementById("choiceChart").getContext("2d");
    datasets = [
      {
        value: yesVal(),
        color: "rgba(0,128,0,0.5)",
        showInLegend: false
      },
      {
        value: noVal(),
        color: "rgba(255,0,0,0.5)"
      }
    ]

     options = {
      // Boolean - Whether to animate the chart
      animation: true,

      // Number - Number of animation steps
      animationSteps: 60,

      percentageInnerCutout : 70,

      // String - Animation easing effect
      // Possible effects are:
      // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
      //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
      //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
      //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
      //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
      //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
      //  easeOutElastic, easeInCubic]
      animationEasing: "easeOutQuart",

      segmentShowStroke : false,
      showTooltips: false,
      onAnimationComplete: updateTotal
    }


    // draw the chart
    // And for a doughnut chart
    myDoughnutChart = new Chart(ctx).Doughnut(datasets, options);

  });

  Template.buttons.events({
    'click #yes': function () {
      Choices.update({_id:Choices.findOne({choice:'Yes'})['_id']}, {$inc:{count: 1}});
      myDoughnutChart.segments[0].value = Choices.findOne({choice:'Yes'}).count;

      myDoughnutChart.update();
    },
    'click #no': function () {
      // increment the counter when button is clicked
      Choices.update({_id:Choices.findOne({choice:'No'})['_id']}, {$inc:{count: 1}});
      myDoughnutChart.segments[1].value = Choices.findOne({choice:'No'}).count;

      myDoughnutChart.update();
    },
  });



  function yesVal() {
      return Choices.findOne({choice:'Yes'}).count;
    }
  function noVal() {
      return Choices.findOne({choice:'No'}).count;
    }

  function updateTotal() {

    var canvasWidthvar = 300;
    var canvasHeight = 300;
    //this constant base on canvasHeight / 2.8em
    var constant = 114;
    var fontsize = (canvasHeight/constant).toFixed(2);
    ctx.font=fontsize +"em Verdana";
    ctx.textBaseline="middle";
    var total = ((yesVal()) + (noVal()));
    var tpercentage = (((yesVal())/total)*100).toFixed(2) + "%";
    var textWidth = ctx.measureText(tpercentage).width;

    var txtPosx = Math.round((canvasWidthvar - textWidth)/2);
    console.log(tpercentage);
    ctx.fillStyle = "rgba(0,128,0,0.5)";
    //var numAnim = new CountUp(ctx, 24.02, 99.99);
    //numAnim.start();
    ctx.fillText(tpercentage, txtPosx, canvasHeight/2);
  }
}

if (Meteor.isServer) {

}
