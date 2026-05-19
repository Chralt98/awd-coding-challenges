type RequestItems = {
  method: string;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  jsonBody: object;
};

class Request {
  constructor(public requestItems: Partial<RequestItems>) {}
}

class RequestBuilder {
  private requestItems: Partial<RequestItems> = {};

  httpMethod(method: string): this {
    this.requestItems.method = method;
    return this;
  }

  url(url: string): this {
    this.requestItems.url = url;
    return this;
  }

  headers(headers: Record<string, string>): this {
    this.requestItems.headers = headers;
    return this;
  }

  queryParams(params: Record<string, string>): this {
    this.requestItems.queryParams = params;
    return this;
  }

  jsonBody(body: object): this {
    this.requestItems.jsonBody = body;
    return this;
  }

  build(): Request {
    if (
      this.requestItems.method &&
      this.requestItems.method === "POST" &&
      !this.requestItems.jsonBody
    ) {
      throw new Error("Method is POST, but no body was provided.");
    }
    if (!this.requestItems.url) {
      throw new Error("The URL has not been set.");
    }
    return new Request(this.requestItems);
  }
}

const httpRequest1 = new RequestBuilder()
  .url("https://google.com")
  .httpMethod("GET")
  .headers({ firstHeader: "X", secondHeader: "Y" })
  .queryParams({ search: "WAGMI" })
  .jsonBody({ someObjectShape: "ThisIsABigObject" })
  .build();
console.log(httpRequest1);

const httpRequest2 = new RequestBuilder().url("https://google.com").build();
console.log(httpRequest2);

// const postWithoutJsonBodyRequest = new RequestBuilder()
//   .url("https://my-favourite-endpoint")
//   .httpMethod("POST")
//   .build();

// const noUrlRequest = new RequestBuilder().httpMethod("GET").build();
