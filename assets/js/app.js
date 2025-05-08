$(document).ready(function () {
    let campData = []
    let trailData = []
    // 露營地JSON
    $.ajax({
        url: './assets/data/campgrounds.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data[0]);
            campData = data
            renderCamp(campData)
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

    //露營地搜尋, 每次先清空避免重複渲染
    function renderCamp(campData){
        let campHtml = ''
        $('.result-container').empty()
        for(let i =0; i<10;i++){
            campHtml += `
                <div class="result__box">
                    <div class="result__box-img">
                        <img src="" alt="" width="150px" height="150px">
                    </div>
                    <div class="result__box-info">
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



    $('#search').on('input', function (){
        let searchValue = this.value.trim()
        let searchWord = searchValue.split(/\s+/)

        let filterCampData = campData.filter(camp => 
            searchWord.every(word => camp.city.includes(word) || camp.district.includes(word) || camp.name.includes(word) )
        )
        renderCamp(filterCampData)
    })

    
});