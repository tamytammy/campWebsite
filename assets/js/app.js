$(document).ready(function () {

    $.ajax({
        url: './assets/data/campgrounds.json', // 確保檔案路徑正確
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data[0]);
        },
        error: function (err) {
            console.error('Error fetching data:', err);
        }
    });

    
});