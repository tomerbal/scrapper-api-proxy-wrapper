const ApiCaller = require("api-caller");
const apiCaller = new ApiCaller(1);

const scrapperApiKey = "";
const country = "us";

const proxyUrl = "localhost:8000";
const proxyAuth = "country-" + country + ":" + scrapperApiKey;

async function run(){
    const websiteResponse = await apiCaller.callGetSessionedProxy("http://www.google.com/search?q=gdasg", {}, "http://" + proxyAuth + "@" + proxyUrl);
    console.log(websiteResponse);

}

run();
