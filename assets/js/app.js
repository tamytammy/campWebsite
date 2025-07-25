$(document).ready(function () {
    let campData = []
    let trailData = []
    let weatherData = []

    let currentPage = 1
    let isLoading = false;
    let activeData = []
    // 露營地JSON
    $.ajax({
        url: './assets/data/campgrounds.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            //新增index id 以利未來使用
            data.forEach((item, index) => {
                item.id = index;
            })

            campData = data
            activeData = campData

            loadProducts(currentPage, campData)
            campDetail()
            campMap()
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
            // console.log(data[0]);
            trailData = data
            renderTrail(trailData)
        },
        error: function (err) {
            console.error('Error fetching data:', err);
        }
    });
    //天氣API
    $.ajax({
       url: 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-093',
    type: 'GET',
    dataType: 'json',
    data: {
        Authorization: 'CWA-067306D4-D204-46B1-AA1C-A6A3E4D6C7AC',
        locationId: 'F-D0047-089'
    },
    success: function (data) { 
        weatherData = data.records.Locations[0].Location
        renderWeather(weatherData)
    },
    error: function (err) {
        console.error('Error fetching data:', err);
    }
    });


    //露營地渲染, 每次先清空避免重複渲染
    function renderCamp(campData){
        let campHtml = ''
        for(let i =0; i<10;i++){
            campHtml += `
                <div class="result__box">
                    <div class="result__box-img">
                        <img src="./assets/images/camp-icon.png" alt="" width="150px" height="150px">
                    </div>
                    <div class="result__box-info campLink" data-id="${campData[i].id}">
                        <div class="result__box-info-title">露營地名稱：${campData[i].name}</div>
                        <div class="result__box-info-address">地址：${campData[i].city}${campData[i].district}${campData[i].address}</div>
                    </div>
                    <div class="like-wrapper">
                        <button type="button" width="50px" height="50px" class="like-btn">
                        <i class="fa-regular fa-heart unclick active"></i>
                        <i class="fa-solid fa-heart clicked"></i></button>
                    </div>

                </div>
            `
        }
        $('.result-container').append(campHtml)

        //點擊愛心
        const likeBtns = document.querySelectorAll('.like-btn');
        likeBtns.forEach(btn=>{
            btn.addEventListener('click',function(){
                this.children[0].classList.toggle('active')
                this.children[1].classList.toggle('active')
            })
        })
    }
    //露營地即時搜尋功能
    $('#search').on('input', function (){
        $('.result-container').empty() // 清空結果容器
        currentPage = 1 // 重置頁碼
        let searchValue = this.value.trim()
        let searchWord = searchValue.split(/\s+/)
        
        activeData = campData.filter(camp => 
            searchWord.every(word => camp.city.includes(word) || camp.district.includes(word) || camp.name.includes(word) )
        )


        $('.result').show()
        $('.main').hide()
        loadProducts(currentPage, activeData) // 重新載入第一頁的產品
    })

    //infinite scroll
    function loadProducts(page, data = campData) {

    let totalPages = Math.ceil(data.length / 10);
    if (page > totalPages) return;

    $('#loading').show();
    isLoading = true;

  setTimeout(() => {
         renderCamp(data.slice((page - 1) * 10, page * 10));
        $('#loading').hide();
        isLoading = false;
  }, 2000); 
    }

    $(window).on('scroll', function () {
  if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
    if (!isLoading) {
      currentPage++;
      loadProducts(currentPage, activeData);
    }
  }
    });


    //露營地網址連結
    function campDetail(){
        let url = new URLSearchParams(window.location.search)
        let id = url.get('id')
        let camp = campData.find(camp => camp.id == id)

        if(camp.mobile == null ){
            camp.mobile = '暫無資料'
        }
        if(camp.website == null ){
            camp.website = '暫無資料'
        }
        //這邊是避免無資料仍有空連結的情況, 會誤導使用者
        let websiteHtml = (camp.website !== '暫無資料') 
        ? `<a href="${camp.website}" target="_blank">${camp.name}</a>`
        : camp.website
        let phoneHtml = (camp.mobile !== '暫無資料' || camp.phone !== null)
        ? `${camp.mobile} / ${camp.phone}`
        : camp.mobile


        let campHtml = `
            <div class="camp__detail">
                <p>露營地名稱：${camp.name}</p>
                <p>所屬區域：${camp.city}${camp.district}</p>
                <p>地址：${camp.address}</p>
                <p>電話：${phoneHtml}</p>
                <p>網址：${websiteHtml}</p>
            </div>
            <div class="camp__images">
                <div id="map" style="height: 300px; width: 100%;"></div>
            </div>
        `
        $('.camp-container').append(campHtml)
        
    }
    //露營地地圖位置(搭配Leaflet OpenStreetMap)
    function campMap(){
        //同樣先找到對應的露營地資料
        let url = new URLSearchParams(window.location.search)
        let id = url.get('id')
        let camp = campData.find(camp => camp.id == id)

        const map = L.map('map').setView([camp.latitude, camp.longitude], 15);
        // 加上底圖圖層（OpenStreetMap）
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // 加上標記
        L.marker([camp.latitude, camp.longitude]).addTo(map).bindPopup('露營地位置').openPopup();

    }
    $('.result-container').on('click', '.campLink', function(){
        const campId = this.dataset.id
        location.href = `campDetail.html?id=${campId}`
    })
    


    // 渲染天氣
    // 1. 當前露營地資料
    // 2. 比對天氣位置資料
    function renderWeather(weatherData){
        let campId = new URLSearchParams(window.location.search).get('id')
        //比對露營地與天氣資料
        let camp = campData.find(camp => camp.id == campId)
        let campCity = camp.city
        let weatherCity = weatherData.find(city =>city.LocationName == campCity)
        let weather = weatherCity.WeatherElement
        $('.cityName').text(campCity)

        console.log('天氣資訊:',weather);

        //天氣溫度
        let weatherTemp = weather[0].Time
        let weatherRainy = weather[7].Time
        // console.log('溫度:', weatherTemp);
        console.log('降雨:',weatherRainy);
        
        //天氣現象描述
        let weatherDesc = weather[9].Time[0].ElementValue[0].WeatherDescription
        // console.log(weatherDesc);

        let groupedByDate = {};
        let groupedByTime = {}

        //將溫度資料依日期分組(五天)
        weatherTemp.forEach(item => {
            let date = item.DataTime.split('T')[0];
            if (!groupedByDate[date]) {
                groupedByDate[date] = [];
            }
            groupedByDate[date].push(item);
        });

        //將降雨資料依日期分組(五天)
        weatherRainy.forEach(item => {
            let time = item.StartTime.split('T')[0]
            if (!groupedByTime[time]) {
                groupedByTime[time] = [];
            }
            groupedByTime[time].push(item);
        });

        console.log(groupedByTime);
        console.log(groupedByDate);
        

        Object.entries(groupedByDate).forEach(([date, dataArray], idx) => {
        const first = dataArray[0];
        const weatherTime = first.DataTime.split('T')[1].substring(0, 5);
        const weatherValue = first.ElementValue[0].Temperature;
        let weatherImg = weatherValue > 25
        ? './assets/images/weather-sun.png'
        : './assets/images/weather-cloudy.png';
        const cardHtml = `
            <div class="weather__box" data-date-index="${idx}">
                <div class="weather__box-date">${date}</div>
                <div class="weather__box-info">
                    <img src="${weatherImg}" alt="" width="100%" height="auto">
                    <p class="weather-temp">溫度：${weatherValue}°C</p>
                </div>
                <div class="weather__box-time">
                    <input type="range" min="0" max="${dataArray.length - 1}" step="1" value="0" class="time-range">
                     <p class="weather-time">${weatherTime}</p>
                </div>
            </div>
        `;

        $('.weather').append(cardHtml);

        });
        Object.entries(groupedByTime).forEach(([date, dataArray], idx) => {
            const first = dataArray[0];
            const rainyTime = first.StartTime.split('T')[1].substring(0, 5);
            const rainyValue = first.ElementValue[0].ProbabilityOfPrecipitation;

            const cardHtml = `
                <p class="weather-rainy">降雨：${rainyValue}%</p>
            `;

            $(`.weather__box[data-date-index="${idx}"] .weather__box-info`).append(cardHtml);
        });

        

         $('.weather__box').each(function (boxIndex) {
        const $box = $(this);
        const $range = $box.find('.time-range');
        const $timeText = $box.find('.weather-time');
        const $tempText = $box.find('.weather-temp');
        const $rainyText = $box.find('.weather-rainy');

        // 找對應的資料
        const date = $box.find('.weather__box-date').text().replace('日期: ', '');
        const dataArray = groupedByDate[date];
        const rainArray = groupedByTime[date];

        $range.on('input', function () {
            const idx = parseInt(this.value);
            const item = dataArray[idx];
            const time = item.DataTime.split('T')[1].substring(0, 5);
            const temp = item.ElementValue[0].Temperature;
            const weatherImg = temp > 28
                ? './assets/images/weather-sun.png'
                : './assets/images/weather-cloudy.png';

            const rainy = rainArray[idx];
            const rainTime = rainy.StartTime.split('T')[1].substring(0, 5);
            const rainProb = rainy.ElementValue[0].ProbabilityOfPrecipitation;

            $timeText.text(`${time}`);
            $tempText.text(`溫度：${temp}°C`);
            $rainyText.text(`降雨：${rainProb}%`);
            $box.find('img').attr('src', weatherImg);
        });
    });


 

    }


    //渲染步道
    function renderTrail(trailData){

        let campId = new URLSearchParams(window.location.search).get('id')
        let camp = campData.find(camp => camp.id == campId)
        let campCity = camp.city
        let trailArea = trailData.filter(trail => trail.TR_POSITION.includes(campCity))
        console.log(trailArea);        
        let trailHtml= ''
        $('.trail-wrapper').empty()
        trailArea.forEach(trail => {
            trailHtml+= `
            <div class="trail-wrapper">
                    <div class="trail-img">
                        <img src="./assets/images/hiking-icon.avif" width="100%" height="auto">
                    </div>

                    <div class="trail-info">
                    <div class="trail-title">
                        <p>所在地區:${trail.TR_POSITION}</p>
                    </div>
                    <div class="trail-list">
                        <div class="list-name">
                            <p>步道名稱:${trail.TR_CNAME}</p>
                            <p>海拔高度:${trail.TR_ALT}m</p>
                            <p>步道總長度:${trail.TR_LENGTH}</p>
                            <p>步道難易度:${trail.TR_DIF_CLASS}</p>
                            <p>步道說明:${trail.TR_PAVE}</p>
                        </div>
                    </div>
                    </div>
            </div>
        `
        })
        $('.trail-container').append(trailHtml);
    }

    if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../service-worker.js")
    .then(reg => console.log("Service Worker registered:", reg))
    .catch(err => console.error("Service Worker registration failed:", err));
}

    
});