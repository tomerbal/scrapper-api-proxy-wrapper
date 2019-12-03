const ApiCaller = require("./index");

var userRetryStrategy = function(err, response, body) {
    const status = err || response.statusCode >= 500 || response.statusMessage === "Forbidden";
    if (status) {
        return true;
    }
    return status;
};


const apiCaller = new ApiCaller(3, 60000, userRetryStrategy);


apiCaller.callGet("https://www.ynegfgfgffgft.co.il/home/0,7340,L-8,00.html", {})
    .then(function(response){
        console.log(response);
    });

// const apiCaller = new ApiCaller(3);
//
// apiCaller.callGet("https://www.walla.co.il/")
//     .then(function(response){
//         console.log(response);
//     });


// const birdToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBVVRIIiwidXNlcl9pZCI6ImQ5OTZkNWZhLTQ3YTEtNDBmYS05ZDY0LTBlNzFmNmRhNDlhZiIsImRldmljZV9pZCI6IjdkMjUyYzkwLTdhNjMtMTFlOS1hNmMxLTM1Y2IzNjFhMDM0ZiIsImV4cCI6MTU4OTgyODA5M30.tZEKVK_D9wUaA_xxT3mLvxGkAnqFXnWLmjQaMsHwf60";
// const deviceId = "7d252c90-7a63-11e9-a6c1-35cb361a034f";
// const lat = "32.0767364501953";
// const lng = "34.7700157165527";
// const timezone = "Asia/Jerusalem";
// const radius = "1000";
// const headers = {
//     "authorization": "Bird " + birdToken,
//     "device-id": deviceId,
//     "app-version": "4.10.1",
//     "location": '{"latitude":"' + lat + '""","longitude":"' + lng + '","speed":0,"altitude":0,"accuracy":10,"heading":-1}',
//     "timezone": timezone
// };
// const url = "https://api.birdapp.com/bird/bounty?latitude=" + lat + "&longitude=" + lng + "&radius=" + radius;
// return proxyCaller.callGet(url, headers);

