$(document).ready(function () {

    var gridSize = 75;

    var gridSet = {
        lineColor: '#FFFFFF',
        rowLineCount: 20,
        columnLineCount: 32,
        opacity: .3,
        lineDuration: 150,
        interval: 50
    };

    var ctx = $('#header-grid').get(0).getContext('2d');

    var height = $('#header-grid').innerHeight();
    var width = $('#header-grid').innerWidth();

    var grid = new GridCanvas(ctx, height, width, gridSet);
    grid.start();

    $(window).on('resize', function () {
        resizeCanvas();
    });

    function resizeCanvas() {
        var parent = $('#header-grid').parent();

        $('#header-grid').get(0).width = parent.width();
        $('#header-grid').get(0).height = parent.height();

        var height = $('#header-grid').innerHeight();
        var width = $('#header-grid').innerWidth();

        $('#header-grid').get(0).width = parent.width();
        $('#header-grid').get(0).height = parent.height();

        var height = $('#header-grid').innerHeight();
        var width = $('#header-grid').innerWidth();


        grid.updateRes(height, width);

        var rc = Math.ceil(height / gridSize);
        var cc = Math.ceil(width / gridSize);
        // 1920/20 = 96

        var newSet = {
            rowLineCount: rc,
            columnLineCount: cc
        };
        grid.updateSettings(newSet);
    }

    resizeCanvas();
});