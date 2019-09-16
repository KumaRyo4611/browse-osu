const URL = "https://osu.ppy.sh/api";
const getBeatMapsUrl = "/get_beatmaps";
const getUserUrl = "/get_user";
const getUserBestUrl = "/get_user_best";
const API_KEY = "XXXXXXXXXXXXXXXXXXXX";

let bestmaplist = [];
let maplist = [];

function createUrl(parameters){
    let paramString = '';
    for(let k of Object.keys(parameters)) {
        if(parameters[k] != null && parameters[k] != '') paramString += k + '=' + parameters[k] + '&';
    }
    return paramString;
}

function get_beatmaps(map){
    // XMLHttpRequestオブジェクトの作成
    let request = new XMLHttpRequest();

    let parameters = {
        k: API_KEY,
        since: null,
        s: null,
        b: map["beatmap_id"],
        u: null,
        type: null,
        m: null,
        a: null,
        h: null,
        limit: '1',
        mods: null
    }

    let nURL = URL + getBeatMapsUrl + '?' + createUrl(parameters);

    // URLを開く
    request.open('GET', nURL, true);
    request.responseType = 'json';

    // レスポンスが返ってきた時の処理
    request.onload = function () {
        let result = this.response;
        let beatmap = result[0];
        let pair = { "beatmap": beatmap, "bestmap": map };
        maplist.push(pair);

        if(maplist.length == bestmaplist.length) createTableRow();
    }

    // リクエストをURLに送信
    request.send();
}

function get_user() {
    // XMLHttpRequestオブジェクトの作成
    let request = new XMLHttpRequest();

    let username = document.user.nametxt.value;
    let parameters = {
        k: API_KEY,
        u: username,
        m: null,
        type: null,
        event_days: null
    }

    let nURL = URL + getUserUrl + '?' + createUrl(parameters);

    // URLを開く
    request.open('GET', nURL, true);
    request.responseType = 'json';

    // レスポンスが返ってきた時の処理 
    request.onload = function () {
        let result = this.response;
        let user = result[0];

        let tablecolumn = document.getElementById("userinfo");
        let row = document.createElement("tr");
        row.innerHTML = "<td>" + user["username"] + "</dt> <td>" + user["level"] + "</td> <td>" + user["pp_rank"] + "</dt> <td>" + user["pp_country_rank"] + "</td> <td>" + user["country"] + "</td>";
        tablecolumn.insertAdjacentElement("beforeend", row);
        
        let a = document.createElement("h2");
        a.innerHTML = "スコアランキング";
        let b = document.getElementById("bestmaps");
        
        b.innerHTML = "";
        b.insertAdjacentElement("afterbegin", a);
    }

    let tablecolumn = document.getElementById("userinfo");
    tablecolumn.innerHTML = "";
    let element = document.createElement("tr");
    element.innerHTML = "<th> ユーザーネーム </th> <th> レベル </th> <th> 世界ランク </th> <th> 国内ランク </th> <th> 国籍 </th>";
    tablecolumn.insertAdjacentElement("afterbegin", element);

    let userinfotitle = document.createElement("h2");
    userinfotitle.innerHTML = "ユーザー情報";
    let userinfos = document.getElementById("userinfos");
    userinfos.innerHTML = "";
    userinfos.insertAdjacentElement("afterbegin", userinfotitle);

    get_user_best(username);

    // リクエストをURLに送信
    request.send();
}

function get_user_best(username) {
    // XMLHttpRequestオブジェクトの作成
    let request = new XMLHttpRequest();

    let parameters = {
        k: API_KEY,
        u: username,
        m: null,
        limit: null,
        type: null
    }

    let nURL = URL + getUserBestUrl + '?' + createUrl(parameters);

    // URLを開く
    request.open('GET', nURL, true);
    request.responseType = 'json';

    // レスポンスが返ってきた時の処理
    request.onload = function () {
        let result = this.response;

        result.forEach(element => {
            bestmaplist.push(element);
            get_beatmaps(element);
        });
    }

    // リクエストをURLに送信
    request.send();

    let tablecolumn = document.getElementById("userbest");
    tablecolumn.innerHTML = "";
    let element = document.createElement("tr");
    element.innerHTML = "<th> ランク </th> <th> タイトル </th> <th> スコア </th> <th> 最大コンボ </th>";
    tablecolumn.insertAdjacentElement("afterbegin", element);
}

function createTableRow(){
    let tablecolumn = document.getElementById("userbest");
    maplist.sort(cmp);
    for(let i = 0; i < maplist.length; ++i){
        let pair = maplist[i];
        let map = pair["beatmap"];
        let bestmap = pair["bestmap"];

        let row = document.createElement("tr");
        let html2 = "./beatmapdetail.html?beatmap_id=" + map["beatmap_id"];
        row.innerHTML = "<td>" + bestmap["rank"] + "</td> <td> <a href=" + html2 + ">" + map["title"] + "</a> </td> <td>" + bestmap["score"] +  "</td> <td>" + bestmap["maxcombo"] + "</td>";

        tablecolumn.insertAdjacentElement("beforeend", row);
    }
    maplist = [];
    bestmaplist = [];
}

function cmp(a, b){
    let bestmapA = a["bestmap"];
    let bestmapB = b["bestmap"];
    return bestmapB["score"] - bestmapA["score"];
}


// beatmaps_detail
function get_beatmaps_datail(param){
    // XMLHttpRequestオブジェクトの作成
    let request = new XMLHttpRequest();
    let nURL = URL + getBeatMapsUrl + "?k=" + API_KEY + "&b=" + param["beatmap_id"];

    console.log(nURL);
    // URLを開く
    request.open('GET', nURL, true);
    request.responseType = 'json';

    // レスポンスが返ってきた時の処理
    request.onload = function () {
        let result = this.response;
        let beatmap = result[0];
        
        console.log(beatmap);

        let table = document.getElementById("beatmap_detail");
        let item = document.createElement("tr");
        item.innerHTML = "<th> タイトル </th> <th> アーティスト </th> <th> 譜面作者 </th> <th> 難易度 </th>";
        table.insertAdjacentElement("afterbegin", item);
        let a = document.createElement("tr");
        a.innerHTML = "<th>" + beatmap["title"] + "</th> <th>" + beatmap["artist"] + "</th> <th>" + beatmap["creator"] + "</th> <th>" + beatmap["version"] + "</th>";
        table.insertAdjacentElement("beforeend", a);
    }

    // リクエストをURLに送信
    request.send();
}