# GridJS

## Introduction

> Animated background grid element written in Javascript

# Installation

## HTML
```
<body>
    ...
    <container>
        <canvas id="yourGrid"></canvas>
    </container>
    ...
    <script src="js/grid.js"></script>
</body>
```
## Javascript
```
...
var settings = {
    lineColor: '#FFFFFF',
    opacity: .3,
    lineDuration: 150,
    interval: 50
}

var canvas = document.getElementById('yourGrid');
var ctx = canvas.getContext('2d');

var height = canvas.clientHeight;
var width = canvas.clientWidth;

var grid = new GridCanvas(ctx, height, width, settings);
grid.start();
...
```

# Some Info

## Settings
<table class="table table-bordered">
        <thead>
        <tr>
            <th>Setting</th>
            <th>Accepts</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>height</code></td>
            <td>Number (Any)</td>
            <td><code>null</code></td>
            <td>Height of the grid element.</td>
        </tr>
        <tr>
            <td><code>width</code></td>
            <td>Number (Any)</td>
            <td><code>null</code></td>
            <td>Width of the grid element.</td>
        </tr>
        <tr>
            <td><code>lineColor</code></td>
            <td>String (Form of '#******')</td>
            <td><code>'#FFFFFF'</code></td>
            <td>The color of the lines drawn.</td>
        </tr>
        <tr>
            <td><code>rowLineCount</code></td>
            <td>Number (Any)</td>
            <td><code>20</code></td>
            <td>Number of rows drawn.</td>
        </tr>
        <tr>
            <td><code>columnLineCount</code></td>
            <td>Number (Any)</td>
            <td><code>20</code></td>
            <td>Number of columns drawn.</td>
        </tr>
        <tr>
            <td><code>opacity</code></td>
            <td>Decimal (0-1)</td>
            <td><code>.7</code></td>
            <td>The opacity of the lines drawn.</td>
        </tr>
        <tr>
            <td><code>interval</code></td>
            <td>Number (Any)</td>
            <td><code>50</code></td>
            <td>Time between line creation. Should be in ms, but isn't currently.</td>
        </tr>
        <tr>
            <td><code>lineDuration</code></td>
            <td>Number (Any)</td>
            <td><code>1000</code></td>
            <td>How long the line takes to reach it's full length. Should be in ms, but isn't currently.</td>
        </tr>
    </tbody>
</table>

## Functions
<table class="table table-bordered">
    <thead>
        <tr>
            <th>Name</th>
            <th>Arguments</th>
            <th>Purpose</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>.start()</code></td>
            <td><code>null</code></td>
            <td>Initializes the grid element.</td>
        </tr>
        <tr>
            <td><code>.stop()</code></td>
            <td><code>null</code></td>
            <td>Stops the grid element.</td>
        </tr>
        <tr>
            <td><code>.updateRes(height, width)</code></td>
            <td><code>height</code>:New Height <code>width</code>:New Width</td>
            <td>Changes the resolution of the grid.</td>
        </tr>
        <tr>
            <td><code>.updateSettings(newSettings)</code></td>
            <td><code>newSettings</code>:Object containing the new settings</td>
            <td>Changes the settings of the grid.</td>
        </tr>
    </tbody>
</table>

## Events
None yet