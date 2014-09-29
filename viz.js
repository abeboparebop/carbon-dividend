//Create the SVG Viewport
var m = [80,80,80,120];
var w = 825 - m[1] - m[3];
var h = 750 - m[0] - m[2];
var h0 = 400;
var axSpc = 150;
var axHt = 150;
var axAdj = 15;
var contSpc = 90;
var contAlign = -30;
var sWd = 150;
var sPad = 50;
var sHt = 100;
var tHt = 40;
var slideDefColor = "#999";

var constants = {};

// function roundToPlaces(number, place)
// {
//   if (place >= 0) {
//     return number.toFixed(place)
//   } else {
//     fact = Math.round(Math.pow(10, -place))
//     return Math.round(number/fact)*fact;
//   }
// }

function valToText(d, val) {
  if (d.tickstyle == null) {
    // return roundToPlaces(val, d.nPlaces) + " (" + d.unit + ")";
    return d3.round(val, d.nPlaces) + " (" + d.unit + ")";
  } else if (d.tickstyle == 'sci') {
    formatter = d3.format('.2s');
    return formatter(val) + " (" + d.unit + ")";
  }
}


for (var i=0; i<sliders.length; i++){
  sliders[i].controllerScale = d3.scale.linear()
      .domain(sliders[i].dom)
    .range([sliders[i].hOff*(sWd+sPad), sWd + sliders[i].hOff*(sWd+sPad)])
      .clamp(true);
}

var svg = d3.select("body").append("svg")
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2])

var bkg = svg.append("rect")
  .attr("class","backgroundBox")
  .attr("x",10).attr("y",10)
  .attr("width","98%").attr("height","98%")
  .attr("rx",60).attr("ry",60)
  // .style("stroke", slideDefColor)
  // .style("stroke-width", 5);

var axesContainer = svg.append("g")
  .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var contContainer = svg.append("g")
  .attr("transform", "translate(" + String(m[3] + contAlign) + "," + String(m[0] + axHt + contSpc) + ")")
  .attr("height", h0);

function drawAxes(init, smooth) {
  init = typeof init !== 'undefined' ? init : false;
  smooth = typeof smooth !== 'undefined' ? smooth : false;
  for (var i=0; i < costs.length; i++) {
    el = costs[i];
    var axisScale = d3.scale.linear()
      .domain([el.fcn(constants.sccMin), 
	       el.fcn(constants.sccMax)])
      .range([axHt, 0]);

    var yAxis = d3.svg.axis()
      .scale(axisScale)
      .orient("left")
      .ticks(5);

    var tag = el.id + "_scale"

    if (init) {
      var axis = axesContainer.append("g")
	.call(yAxis)
	.attr("class", "y axis")
	.attr("id", tag)
	.attr("transform", "translate(" + (i*axSpc + axAdj) + " ,20)");

      axis.append("text")
	.text(el.txt)
	.attr("class", "axisTitle")
	.attr("transform", function(d) {return "translate(" + (-axAdj) + ",-20)"})
	.style("text-anchor","middle")
      axis.append("text")
	.text(valToText(el, el.fcn(constants.scc)))
	.attr("class", "axisUnit")
	.attr("transform", function(d) {return "translate(" + (-axAdj) + "," + (axHt+30) + ")"})
	.style("text-anchor","middle")
    } else {

      if (smooth) {
	var axis = axesContainer.select('#'+tag)
	  .transition()
	  .call(yAxis)
      } else {
	var axis = axesContainer.select('#'+tag)
	  .call(yAxis)
      }

      axis.select(".axisUnit")
	.text(valToText(el, el.fcn(constants.scc)))
    }
  }

  var sccScale = d3.scale.linear()
    .domain([constants.sccMin, 
	     constants.sccMax])
    .range([axHt, 0])
    .clamp(true);

  if (init) {
    sccTag = "#scc_scale"
    nAxes = costs.length
    lineHt = sccScale(constants.scc)
    sccAxis = axesContainer.select(sccTag)
      .append("g")
      .attr("class","scc_dragger")
      .attr("transform", "translate(0," + (lineHt) + ")")
      .on("mouseover", function() {
      	d3.selectAll(this.childNodes)
      	  .classed("active",true);
	d3.select(".dragLine")
	  .style("stroke","#099");
      })
      .on("mouseout", function() {
      	d3.selectAll(this.childNodes)
      	  .classed("active",false);
	d3.select(".dragLine")
	  .style("stroke",slideDefColor);
      })
    
    var drag = d3.behavior.drag()
      .on("drag", dragSlider);

    sccAxis.call(drag);

    sccRect = sccAxis
      .append("rect")
      .attr("class", "dragRect")
      .attr("width", (nAxes-1)*axSpc + 40)
      .attr("height", 40)
      .attr("transform", "translate(-20,-20)")
      .attr("opacity", 0)

    sccLine = sccAxis
      .append("line")
      .attr("class", "dragger dragLine")
      .attr("x1",0).attr("x2",(nAxes-1)*axSpc)
      .attr("y1",0).attr("y2",0)
      .style("stroke",slideDefColor)
      // .attr("opacity",0.5)

    var hdlW = 20;
    var hdlH = 6;
    sccAxis
      .append("rect")
      .attr("class","dragger dragHandle")
      .attr("width", hdlW).attr("height", hdlH).attr("rx",3).attr("ry",3)
      .attr("x", -hdlW/2)
      .attr("y", -hdlH/2)

    sccAxis
      .append("rect")
      .attr("class","dragger dragHandle")
      .attr("width", hdlW).attr("height", hdlH).attr("rx",3).attr("ry",3)
      .attr("x", -hdlW/2 + (nAxes-1)*axSpc)
      .attr("y", -hdlH/2)
      // .append("circle")
      // .attr("class", "dragHandle")
      // .attr("cx",(nAxes-1)*axSpc)
      // .attr("cy",0)
      // .attr("r",7)

    function dragSlider(d) {
      scc = sccScale.invert(d3.event.y);
      yPos = sccScale(scc);
      d3.select(this)
	.attr("transform", "translate(0," + (yPos) + ")")
      constants.scc = scc;
      drawAxes();
    }
  }
  // else {
  //   lineHt = sccScale(constants.scc)
  //   sccAxis = axesContainer.select("scc_dragger")
  //     .attr("transform", "translate(0," + (lineHt) + ")")
  // }
  else if (smooth) {
    sccTag = "#scc_scale"
    lineHt = sccScale(constants.scc)
    axesContainer.select(".scc_dragger")
      .transition()
      .attr("transform", "translate(0," + (lineHt) + ")")
  }
}

function drawSliders() {
  for (var i=0; i<sliders.length; i++) {
    el = sliders[i];

    slider = contContainer.append("g")
      .attr("class","x axis")
      // .attr("transform", "translate(" + el.hOff + "," + (sHt / 2 + el.vOff) + ")")
      .attr("transform", "translate(0," + (sHt / 2 + el.vOff * (sHt)) + ")")
    axis = d3.svg.axis()
      .scale(el.controllerScale)
      .orient("bottom")
      .ticks(3)
      .tickFormat(d3.format('.2s'))
    slider.call(axis);
  }
}

drawSliders();
sliderAxes = contContainer.selectAll(".x.axis").data(sliders)
restoreDefaults(true)



var sliderVals = sliderAxes
  .append("text")
  .attr("class","sliderVal")
  .attr("cx", 0).attr("cy", 0)
  .text(function(d) {return valToText(d, d.val)})
  .attr("transform", function(d) {return "translate(" + (d.hOff*(sWd+sPad)+sWd/2) + ",40)"})
  .style("text-anchor","middle")

function updateSliderVals() {
  sliderAxes.selectAll(".sliderVal")
    .text(function(d) {return valToText(d, d.val)})
}

var sliderTexts = sliderAxes
  .append("text")
  .attr("class","sliderTitle")
  .attr("cx", 0).attr("cy", 0)
  .text(function(d) {return d.txt})
  .attr("transform", function(d) {return "translate(" + (d.hOff*(sWd+sPad)+sWd/2) + ",-20)"})
  .style("text-anchor","middle")

var drag = d3.behavior.drag()
  .on("drag", dragmove);

var hdlW = 6;
var hdlH = 20;

var sRectW = 20;
var sRectH = 40;

var sliderDraggers = sliderAxes
  .append("g")
  .attr("class","sliderDragger")
  // .attr("transform", "translate(0," + (lineHt) + ")")
  .attr("transform", function(d) {return "translate(" + (d.controllerScale(d.val)) + ",0)"})
  .on("mouseover", function() {
    d3.selectAll(this.childNodes)
      .classed("active",true);
  })
  .on("mouseout", function() {
    d3.selectAll(this.childNodes)
      .classed("active",false);
  })

sliderDraggers.call(drag)

sliderRects = sliderDraggers
  .append("rect")
  .attr("class","sliderRect")
  .attr("x", 0.0 - sRectW/2)
  .attr("y", 0.0- sRectH/2)
  .attr("height", sRectH).attr("width", sRectW)
  .attr("opacity", 0.0)

var handles = sliderDraggers
  .append("rect")
  .attr("class","sliderHandle")
  .attr("width", hdlW).attr("height", hdlH).attr("rx",3).attr("ry",3)
  .attr("x", -hdlW/2)
  .attr("y", - 3*hdlH/5)
  .attr("opacity", 1)
  // .call(drag)

function dragmove(d) {
  xVal = d.controllerScale.invert(d3.event.x);
  xPos = d.controllerScale(xVal);
  d3.select(this)
    .attr("transform", function(d) {return "translate(" + xPos + ",0)"})
  d.val = xVal;
  d.dragmove(xVal);
  drawAxes();
  updateSliderVals();
}

buttonHt = 40;
buttonWd = sWd;
defaultsObj = contContainer.append("g")
  .attr("transform", "translate(" + (0.5*(sWd+sPad) + 0.5*buttonWd) + "," + (buttonHt + 3.0 * (sHt)) + ")")
  .on("mouseover", function() {
    d3.selectAll(this.childNodes)
      .classed("active",true);
  })
  .on("mouseout", function() {
    d3.selectAll(this.childNodes)
      .classed("active",false);
  })
  .on("click", function() {
    restoreDefaults();
  })

defaultsObj.append("rect")
  .attr("width",buttonWd).attr("height",buttonHt)
  .attr("x",-buttonWd/2).attr("y",-buttonHt/2)
  .attr("rx", 10).attr("ry",10)
  .attr("class","restoreButton")
  // .attr("opacity",0.5)
defaultsObj.append("text")
  .attr("class","restoreText")
  .text("restore defaults")
  // .attr("transform", function(d) {return "translate(" + (-axAdj) + ",-20)"})
  .style("text-anchor","middle")
  .attr("dy",".3em")

boxHt = 350;
boxWd = 300;
boxObj = contContainer.append("g")
  .attr("transform", "translate(" + (2.0*(sWd+sPad) + 0.5*boxWd) + "," + 0.5*(boxHt) + ")")

boxObj.append("rect")
  .attr("width",boxWd).attr("height",boxHt)
  .attr("x",-boxWd/2).attr("y",-boxHt/2)
  .attr("rx", 20).attr("ry",20)
  .attr("class","boxRect")
boxObj.append("text")
  .attr("class","boxTitle")
  .text("Carbon Dividend Calculator")
  // .attr("transform", function(d) {return "translate(" + (-axAdj) + ",-20)"})
  .style("text-anchor","middle")
  .attr("y",-boxHt/2+30)

d3.select("body").append("div")
  .style("position","absolute")
  .style("left", (2.0*(sWd+sPad)) +m[3])
  .style("width", boxWd - 30)
  .style("top", axHt + contSpc + m[0] + 60)
  .style("height", boxHt - 70)
  .append("div")
  .attr("class","boxText")
  .html("This calculator explores what would happen if the U.S. were to impose a carbon tax on CO2 and equivalent heat-trapping emissions, and to redistribute that tax back to U.S. citizens as a \"carbon dividend.\"" +
	"<p>" +
	"Various consumer goods (like gas, electricity, and food) would cost more, but for light users of non-renewables, the dividend would outweigh the additional costs." +
	"<p>" +
	"Defaults here are typical US per-capita values, but modify them to see how you might be affected. More information may be found on my blog post." + 
	"<p>" +
	"Created by Jacob Lynn. See " + 
	"<a href=\"https://github.com/abeboparebop/carbon-dividend\">GitHub repo</a> for commit history.")

function restoreDefaults(init) {
  init = typeof init !== 'undefined' ? init : false;
  for (key in defConstants) {
    constants[key] = defConstants[key];
  }
  for (var i=0; i<sliders.length; i++) {
    sliders[i].val = sliders[i].def*1.;
  }
  drawAxes(init, true);
  updateSliderVals();
  sliderAxes.selectAll('.sliderDragger')
    .transition()
    .attr("transform", function(d) {return "translate(" + d.controllerScale(d.val) + ",0)";})
}