$(document).ready(function () {
    const campData = []
    const trailData = []
    // 露營地JSON
    $.ajax({
        url: './assets/data/campgrounds.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data[0]);
            campData = data
        },
        error: function (err) {
            console.error('Error fetching data:', err);
        }
    });

    // 步道JSON
    $.ajax({
        url: './assets/data/hikingRoad.json', 
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data[0]);
            trailData = data
        },
        error: function (err) {
            console.error('Error fetching data:', err);
        }
    });

    
});