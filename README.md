#  天氣預報 + 露營地查詢小工具

這是一個以原生 JavaScript 與 jQuery 製作的網頁應用，結合中央氣象局天氣 API 與露營地資料，提供使用者查詢各地露營地天氣預報的功能。

##  預期專案功能

- 根據使用者選擇的露營地區，提供露營地資訊
   - 露營地搜尋
- 露營地詳細內容將結合該地區
   - 搭配中央氣象局API即時顯示天氣資訊
   - 提供附近的步道資訊
- PWA功能、可加入至主畫面(無法離線存取)
- 尚未完成功能
  - 增加天氣詳細敘述等其他資訊
  - 首頁預設資料根據使用者位置渲染


##  資料來源

- **中央氣象局（CWA）開放資料平台**
  - API: [https://opendata.cwa.gov.tw/](https://opendata.cwa.gov.tw/)
  - 使用資料集：`F-C0032-005`（36小時天氣預報）
- **Campground Information for the Whole of Taiwan**
  - CSV: [https://data.gov.tw/en/datasets/132066](https://data.gov.tw/en/datasets/132066)
- **林業保育署自然步道基本資料 農業資料開放平台**
  - JSON: [https://data.moa.gov.tw/open_search.aspx?id=D51](https://data.moa.gov.tw/open_search.aspx?id=D51)

##  使用方式

1. 將本專案 clone 至本地：
   ```bash
   git clone https://github.com/yourname/weather-camp-project.git
2. Github Pages：
  [https://tamytammy.github.io/campWebsite/](https://tamytammy.github.io/campWebsite/)

##  作者資訊

- **作者**：何怡德
- **聯絡信箱**：momo09041027@gmail.com

