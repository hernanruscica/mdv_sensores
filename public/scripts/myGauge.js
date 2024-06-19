//console.log("desde myGauge.js");


function drawGauge(currentValue, alarmMax, alarmMin){
 // Set up the dimensions and margins of the graph
 var width = 320;
 var height = 240;
 var margin = { top: 20, right: 20, bottom: 30, left: 20 };

 // Append the svg object to the body of the page
 var svg = d3.select("#gauge")
     .append("svg")
     .attr("width", width)
     .attr("height", height)
     .append("g")
     .attr("transform", "translate(" + width / 2 + "," + height / 1.5 + ")");

 var gaugeValue = currentValue;  // valor de la aguja

  // Add min, max, and alarm lines and labels
 var alarm1Value = 25;
 var alarm2Value = 50;
 var alarm3Value = 75;
 var alarmMaxValue = alarmMax;
 var alarmMinValue = alarmMin;
 var minValue = 0;
 var maxValue = 100;

 // Define the inner and outer radius
 var outerRadius = Math.min(width, height) / 2 - margin.top;
 var innerRadius = outerRadius - 30;

 // Create the arc generator
 var arc = d3.arc()
     .innerRadius(innerRadius)
     .outerRadius(outerRadius)
     .startAngle(function(d) { return d.startAngle; })
     .endAngle(function(d) { return d.endAngle; });

 // Create the scale for the gauge
 var x = d3.scaleLinear()
     .domain([0, 100])
     .range([-Math.PI / 2, Math.PI / 2]);

 // Add background arcs// Rojo #FF6666 // Amarillo #FFFF00 naranja #FFCC66 // Verde #66CC66
 var arcData = [
     { startAngle: -Math.PI / 2, endAngle: x(alarmMinValue), color: "#FF6666" }, 
     { startAngle: x(alarmMinValue ), endAngle: x(alarmMinValue ), color: "#FFCC66" }, 
     { startAngle: x(alarmMinValue ), endAngle: x(alarmMaxValue ), color: "#66CC66" }, 
     { startAngle: x(alarmMaxValue ), endAngle: x(alarmMaxValue), color: "#FFCC66" }, 
     { startAngle: x(alarmMaxValue), endAngle: Math.PI / 2, color: "#FF6666" } 
 ];

 svg.selectAll("path")
     .data(arcData)
     .enter()
     .append("path")
     .attr("d", arc)
     .attr("fill", function(d) { return d.color; })
     .attr("class", "arc");

 // Add the needle
 var needle = svg.append("line")
     .attr("x1", 0)
     .attr("y1", 0)
     .attr("x2", 0)
     .attr("y2", -innerRadius)            
     .attr("transform", "rotate(" + (x(0) * 180 / Math.PI) + ")")
     .attr("class", "needle");

 needle.transition()
     .duration(1000) // Duración de la animación en milisegundos
     .attr("transform", "rotate(" + (x(gaugeValue) * 180 / Math.PI) + ")");
     
 

   
 // Add the target line
 var targetValue = 75;
 svg.append("line")
     .attr("x1", 0)
     .attr("y1", -outerRadius - 10)
     .attr("x2", 0)
     .attr("y2", -innerRadius + 10)
     .attr("transform", "rotate(" + (x(targetValue) * 180 / Math.PI) + ")")
     .attr("class", "target-line");

 // Add text labels for the percentage below the needle
 svg.append("text")
     .attr("x", 0)
     .attr("y", outerRadius + 40)
     .attr("class", "label")
     .text(gaugeValue + "%");

 svg.append("text")
     .attr("x", (outerRadius + 20) * Math.cos(x(targetValue)))
     .attr("y", (outerRadius + 20) * Math.sin(x(targetValue)))
     .attr("class", "label")
     .attr("dy", ".35em")
     .text("75%");



 // Function to add lines and labels
 function addLineAndLabel(value, label, className) {
     var angle = x(value) * 180 / Math.PI;
     svg.append("line")
         .attr("x1", 0)
         .attr("y1", -outerRadius - 5)
         .attr("x2", 0)
         .attr("y2", -innerRadius + 5)
         .attr("transform", "rotate(" + angle + ")")
         .attr("class", className);
     svg.append("text")
         .attr("x", (outerRadius + 20) * Math.cos(x(value) - Math.PI / 2))
         .attr("y", (outerRadius + 25) * Math.sin(x(value) - Math.PI / 2))
         .attr("class", `label ${className.includes('-alarm-line') ? 'min-max-label' : ''}`)
         .attr("dy", ".35em")
         .text(label);
 }

 addLineAndLabel(minValue, "0%", "alarm-line");
 addLineAndLabel(alarmMinValue, `MIN`, "min-alarm-line");
 addLineAndLabel(alarm1Value, "25%", "alarm-line");
 addLineAndLabel(alarm2Value, "50%", "alarm-line");
 addLineAndLabel(alarm3Value, "75%", "alarm-line");
 addLineAndLabel(alarmMaxValue, `MAX`, "max-alarm-line");
 addLineAndLabel(maxValue, "100%", "alarm-line");

 // Add the current value label below the needle
 svg.append("text")
     .attr("x", 0)
     .attr("y", 20)  // Adjust this value to position the label correctly
     .attr("class", "label value-label")
     .text(gaugeValue + "%");
}