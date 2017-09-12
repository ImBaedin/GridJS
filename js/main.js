$(document).ready(function(){

    var ctx = $('#gridMeBro').get(0).getContext('2d');

    var height = $('#gridMeBro').outerHeight();
    var width = $('#gridMeBro').outerWidth();

    var gridSet = {
        lineColor: '#FFFFFF',
        rowLineCount: 20,
        columnLineCount: 30,
        opacity: .5,
        lineDuration: 150
    };

    var grid = new GridCanvas(ctx, height, width, gridSet);
    grid.start();
});