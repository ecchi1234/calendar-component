import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_API_URL } from "config/consts";
import { Repository } from "@react3l/react3l/core";
import { serialize } from "@react3l/react3l/helpers";
import appMessageService, { messageType } from "services/app-message-service";
import { FORBIDENT_ROUTE, LOGIN_ROUTE } from "config/route-consts";
import * as Cookie from "js-cookie";

export const httpConfig: AxiosRequestConfig = {
  withCredentials: false,
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

Repository.requestInterceptor = function(
  config: AxiosRequestConfig
): AxiosRequestConfig {
  if (typeof config.params === "object" && config.params !== null) {
    config.params = serialize(config.params);
  }

  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
    return config;
  }

  if (typeof config.data === "object" && config.data !== null) {
    config.data = serialize(config.data);
  }

  return config;
};

Repository.responseInterceptor = function(
  response: AxiosResponse
): AxiosResponse {
  if (typeof response.data === "object" && response.data !== null) {
    if (response.headers["content-type"]?.startsWith("application/json")) {
      response.data = serialize(response.data);
    } // serialize data just apply with json
  }
  return response;
};

Repository.errorInterceptor = function(error: AxiosError): AxiosError {
  // log error if dev environment
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Bạn cần kiểm tra lại các trường dữ liệu",
          description: error.response.statusText,
        });
        break;
      case 401:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Bạn chưa đăng nhập để thực hiện thao tác",
          description: error.response.statusText,
        });
        Cookie.remove("Token");
        window.location.href = LOGIN_ROUTE;
        break;
      case 403:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Bạn không có quyền thực hiện thao tác",
          description: error.response.statusText,
        });
        window.location.href = FORBIDENT_ROUTE;
        break;
      case 420:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Lỗi BE",
          description: error.response.statusText,
        });
        break;
      case 500:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Lỗi hệ thống",
          description: error.response.statusText,
        });
        break;
      case 502:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Server BE không hoạt động",
          description: error.response.statusText,
        });
        break;
      case 504:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Phản hồi quá chậm",
          description: error.response.statusText,
        });
        break;
      default:
        break;
    }
  }
  throw error;
};
