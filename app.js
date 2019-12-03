const ProxyChain = require('proxy-chain');
const appConfig = require("./config/app-config");
const ApiCaller = require("api-caller");

const apiCaller = new ApiCaller(1);

const server = new ProxyChain.Server({
    port: 8000,
    verbose: true,

    prepareRequestFunction: async ({request, username, password, hostname, port, isHttp, connectionId}) => {
        const country = getCountry(username);
        let scrapperApiUrl = appConfig.endpoint + "?api_key=" + password + "&url=" + request.url;
        if (country){
            scrapperApiUrl = scrapperApiUrl + "&country_code=" + country;
        }
        const scraperApiResponse = await apiCaller.callGet(scrapperApiUrl, {});

        return {
            customResponseFunction: () => {
                return {
                    statusCode: scraperApiResponse.statusCode,
                    body: scraperApiResponse.body,
                };
            },
        };
    },
});

function getCountry(username) {
    if (username.indexOf("country") >= 0) {
        const splitted = username.split("-");
        return splitted[splitted.length - 1];
    }
    return false;
}

server.listen(() => {
    console.log(`Proxy server is listening on port ${server.port}`);
});