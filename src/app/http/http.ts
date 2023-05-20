import storageUtil, { Constants } from "../utils/storageUtil";
import { ResponseEntity } from "./api-stores";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
}

export interface HttpError {
  errorCode: number;
  errorStr: string;
}

class HttpRequest<T> {
  url: string;
  method: HttpMethod;
  params: Record<string, any>;

  constructor(
    url: string,
    method: HttpMethod,
    params: Record<string, any> = []
  ) {
    this.url = url;
    this.method = method;
    this.params = params;
  }

  /**
   * 发起请求
   * @param signal new AbortController(); 用于取消请求
   * @param fail
   const controller = new AbortController();
   *
   */
  async query(
    fail?: ((error: HttpError) => void) | "ignore",
    signal?: AbortSignal
  ): Promise<ResponseEntity<T> | null> {
    return new Promise(async (resolve, reject) => {
      let url = this.url;
      if (this.method === HttpMethod.GET) {
        if (this.params != null) {
          const paramsArray: string[] = [];
          //拼接参数
          Object.keys(this.params).forEach((key) =>
            paramsArray.push(key + "=" + this.params[key])
          );
          if (this.url.search(/\?/) === -1) {
            url += "?" + paramsArray.join("&");
          } else {
            url += "&" + paramsArray.join("&");
          }
        }
      }
      //如果url是以&结尾，就去掉&
      if (url.endsWith("&")) {
        url = url.substring(0, url.length - 1);
      }
      try {
        const response = await fetch(url, {
          method: this.method,
          signal: signal,
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Origin": "*",
            Accept: "*/*",
            Authorization: "Bearer " + storageUtil.get(Constants.token),
          },
          body:
            this.method === HttpMethod.GET ? null : JSON.stringify(this.params),
        });
        if (response.ok) {
          const data: ResponseEntity<T> = await response.json();
          const token = response.headers.get("token");
          if (token != "" && token != "undefined" && token != "null") {
            storageUtil.set(Constants.token, token);
          }
          if (data.code === 0) {
            resolve(data);
          } else {
            if (data.code === 401) {
              storageUtil.remove(Constants.token);
            } else if (fail) {
              if (fail != "ignore") {
                fail({ errorCode: data.code, errorStr: data.message });
              } else {
                resolve(null);
              }
            } else {
              reject({ errorCode: data.code, errorStr: data.message });
            }
          }
        } else {
          if (fail) {
            if (fail != "ignore") {
              fail({
                errorCode: response.status,
                errorStr: response.statusText,
              });
            } else {
              resolve(null);
            }
          } else {
            reject({
              errorCode: response.status,
              errorStr: response.statusText,
            });
          }
        }
      } catch (e: any) {
        if (fail) {
          if (fail != "ignore") {
            fail({ errorCode: -1, errorStr: e });
          } else {
            resolve(null);
          }
        } else {
          reject({ errorCode: -1, errorStr: e });
        }
      }
    });
  }
}

export default HttpRequest;
