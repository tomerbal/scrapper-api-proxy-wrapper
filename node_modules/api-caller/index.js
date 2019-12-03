class ApiCaller {

    constructor(maxAttempts, timeout = 60000, userRetryStrategy) {
        this.requestretry = require("requestretry");
        this.options = {
            maxAttempts: maxAttempts,
            retryStrategy: myRetryStrategy,
            gzip: true,
            timeout: timeout
        };
        if (userRetryStrategy){
            this.options.retryStrategy = userRetryStrategy;
        }
        else{
            this.options.retryStrategy = myRetryStrategy;
        }
    }

    setRetryStrategy(retryStrategy){
        const self = this;
        self.options.retryStrategy = retryStrategy;
    }

    configureHttpAgent(httpAgent) {
        this.options.agent = httpAgent;
    }

    configureProxy(url) {
        this.requestretry = this.requestretry.defaults({proxy: url});
    }

    async callGetPlain(url, headers, additionalOptions) {
        let options = Object.assign({}, this.options);
        if (additionalOptions){
            options = Object.assign(options, additionalOptions);
        }
        options.uri = url;
        options.headers = headers;
        options.method = "GET";
        return this.requestretry(options);
    }

    async callGet(url, headers) {
        const options = Object.assign({}, this.options);
        if (this.options.hasOwnProperty("agent")){
            options.agent = this.options.agent;
        }
        options.uri = url;
        options.headers = headers;
        options.method = "GET";
        options.json = true;
        return this.requestretry(options);
    }

    async callGetSessionedProxy(url, headers, proxyUrl) {
        const proxiedRequest = this.requestretry.defaults({proxy: proxyUrl});
        const options = Object.assign({}, this.options);
        if (this.options.hasOwnProperty("agent")){
            options.agent = this.options.agent;
        }
        options.uri = url;
        options.headers = headers;
        options.method = "GET";
        options.json = true;
        return proxiedRequest(options);
    }

    async callGetPainSessionedProxy(url, headers, proxyUrl, additionalOptions) {
        const proxiedRequest = this.requestretry.defaults({proxy: proxyUrl});
        let options = Object.assign({}, this.options);
        if (this.options.hasOwnProperty("agent")){
            options.agent = this.options.agent;
        }
        options = Object.assign(options, additionalOptions);
        options.uri = url;
        options.headers = headers;
        options.method = "GET";
        return proxiedRequest(options);
    }

    async callPostSessionedProxy(url, headers, body, proxyUrl) {
        const proxiedRequest = this.requestretry.defaults({proxy: proxyUrl});
        const options = Object.assign({}, this.options);
        options.uri = url;
        options.headers = headers;
        options.method = "POST";
        options.json = true;
        options.body = body;
        return proxiedRequest(options);
    }


    async callPostCustomMaxAttempts(url, headers, maxAttempts, body) {
        const options = Object.assign({}, this.options);
        options.uri = url;
        options.headers = headers;
        options.method = "POST";
        options.json = true;
        options.maxAttempts = maxAttempts;
        options.body = body;
        return this.requestretry(options);
    }

    async callGetCustomMaxAttempts(url, headers, maxAttempts) {
        const options = Object.assign({}, this.options);
        options.uri = url;
        options.headers = headers;
        options.method = "GET";
        options.json = true;
        options.maxAttempts = maxAttempts;
        return this.requestretry(options);
    }

    async callPost(url, headers, body) {
        const options = Object.assign({}, this.options);
        options.uri = url;
        options.headers = headers;
        options.method = "POST";
        options.json = true;
        options.body = body;
        return this.requestretry(options);
    }

    async callPostForm(url, headers, body) {
        const options = Object.assign({}, this.options);
        options.uri = url;
        options.headers = headers;
        options.method = "POST";
        options.form = body;
        return this.requestretry(options);
    }

    async callPut(url, headers, body){
        const options = Object.assign({}, this.options);
        options.uri = url;
        options.headers = headers;
        options.method = "PUT";
        options.json = true;
        options.body = body;
        return this.requestretry(options);
    }
}

function myRetryStrategy(err, response, body) {
    const status = err || response.statusCode >= 500 || response.statusMessage === "Forbidden";
    if (status) {
        let message = "Error on calling api \n";
        if (response && response.hasOwnProperty("request") && response.request.hasOwnProperty("headers") && response.request.headers.hasOwnProperty("authorization")) {
            message = message + "Authorization: " + response.request.headers.authorization + ".\n";
        }
        if (response && response.req && response.req.res && response.req.res.request) {
            message = message + "On endpoint: " + response.req.res.request.href + ". \n";
        }
        if (err) {
            message = message + " Err: " + err + ".\n";
        }
        if (response && response.body && response.body.error) {
            message = message + "Response body error: " + response.body.error + ".\n";
        }
        if (response && response.body && response.body.message) {
            message = message + "Response body message: " + response.body.message + ".\n";
        }
        if (response && response.statusCode !== 200) {
            message = message + "Response body: " + response.body + ".\n";
            message = message + "Response status message: " + response.statusMessage + ".\n";
        }
        console.warn(message);
        return true;
    }
    return status;
}

module.exports = ApiCaller;