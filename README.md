
# anchart3d

## A library for 3-dimensional charts utilizing three.js and tween.js

#### Contributors
- Amar Bajric ([amarbajric](https://github.com/amarbajric))
- Michael Fuchs ([deKilla](https://github.com/deKilla))
- Timo Hasenbichler ([timoooo](https://github.com/timoooo))

#### Preface

This project has been developed by three ambitious students, who are studying at the university "FH Joanneum" in Graz, Austria. 
The project is an open source library for visualizing JSON data as three dimensional Charts (e.g. Pie Charts or Bar Charts), which are not 
just perspective 3D, but are also interactive (e.g. you can zoom in/out or rotate), and therefore visualize a lot more data. 
It offers an intuitive configuration and is overall very comprehensible due to the structured and easy-to-use API.

#### Installation

In order to easily use anchart3d in your project, just use
    npm install anchart3d
and you're good to go.

#### Getting started

Just place this script tag at the bottom of your page and initialize it as shown below.

```
<script type="text/javascript" src="js/anchart3d.js"></script>
```
There is also an optional stylesheet file "anchart3d.css", that contains basic styling information to get things started easier. 
After that, you need to initialize and (optionally) configure the chart:

```
var configuration = {
    "details": true,
    "tooltip": true,
    "showOnScreenControls": true,
    "legend": true,
    "startAnimation": true,
    "antialias": true,
};

 var pieChart = anchart3d.createChart("anchart3d")
    .setConfig(configuration)
    .pieChart()
    .data(jsonData)
    .draw();
```
createChart("anchart3d") points to a ```<div>``` in the document having the id="anchart3d". This div will contain all chart related elements. The name or the id respectively, can be anything but has to the same in the div and must be passed as argument to the createChart() method.

#### Further reading

Feel free to have a look at the project website to find out about all the possiblities and how to use them:

https://dekilla.github.io/anchart3d