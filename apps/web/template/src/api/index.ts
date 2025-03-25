import init, { JsApiClient } from "@ascend/api-client/api_client";

const LOCAL_GATEWAY = "http://localhost:8080";

let client: JsApiClient | null = null;

export const initApiClient = async (baseUrl: string = LOCAL_GATEWAY) => {
  if (!client) {
    await init();
    client = new JsApiClient(baseUrl);
  }

  return client;
};

export const getGatewayHealth = async() => {
    const api = await initApiClient();
    return await api.getGatewayHealth();
}
