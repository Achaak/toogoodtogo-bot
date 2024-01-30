import type {
  ApiAuthPolling,
  ApiItems,
  ApiLogin,
  ApiParams,
  ApiRefresh,
} from './types/api.js';
import { sleep } from './utils/sleep.js';
import { env } from './env/server.js';

export const BASE_URL = 'https://apptoogoodtogo.com/api/';
export const ENDPOINT = {
  AUTH_POLLING: 'auth/v3/authByRequestPollingId',
  REFRESH_TOKEN: 'auth/v3/token/refresh',
  AUTH_BY_EMAIL: 'auth/v3/authByEmail',
  ITEM: 'item/v8/',
} as const;
const DEVICE_TYPE = 'ANDROID';

const LIST_USER_AGENT: string[] = [
  'TGTG/{apk} Dalvik/2.1.0 (Linux; U; Android 9; Nexus 5 Build/M4B30Z)',
  'TGTG/{apk} Dalvik/2.1.0 (Linux; U; Android 10; SM-G935F Build/NRD90M)',
  'TGTG/{apk} Dalvik/2.1.0 (Linux; Android 12; SM-G920V Build/MMB29K)',
];

class APIClient {
  private userAgent = '';
  private cookie = '';
  private captchaError = 0;

  private async getApkVersion() {
    let apkVersion = '';

    const apk = await fetch(
      'https://play.google.com/store/apps/details?id=com.app.tgtg&hl=en&gl=US'
    )
      .then((res) => res.text())
      .catch((err) => {
        console.log('Error fetching APK version', err);
        return '';
      });
    const regExp =
      /AF_initDataCallback\({key:\s*'ds:5'.*? data:([\s\S]*?), sideChannel:.+<\/script/gm;

    const match = regExp.exec(apk);

    if (match) {
      const data = JSON.parse(match[1]) as unknown as string[][][][][][];
      apkVersion = data[1][2][140][0][0][0];
    }

    console.log('APK Version:', apkVersion);

    return apkVersion;
  }

  private async getUserAgent(): Promise<string> {
    const apk = await this.getApkVersion();
    return LIST_USER_AGENT[
      Math.floor(Math.random() * LIST_USER_AGENT.length)
    ].replace('{apk}', apk);
  }

  private async fetch({
    endpoint,
    body,
    headers,
  }: { endpoint: string } & ApiParams): Promise<Response> {
    if (!this.userAgent) {
      this.userAgent = await this.getUserAgent();
    }

    const request = this.request({ endpoint, headers, body });

    const res = await fetch(request);

    this.cookie = res.headers.get('set-cookie') ?? '';
    if (res.ok) {
      this.captchaError = 0;
      return res;
    }

    if (res.status === 403) {
      this.captchaError++;
      console.log(`Error 403: Captcha Error ${this.captchaError}`);
    } else {
      throw res;
    }

    if (this.captchaError === 1) {
      console.log('Changing User Agent');
      this.userAgent = await this.getUserAgent();
    }
    if (this.captchaError === 4) {
      this.cookie = '';
    }
    if (this.captchaError >= 10) {
      console.log('Too many captcha Errors !', 'Sleeping 10 minutes');

      await sleep(1000 * 60 * 10);
      console.log('Retrying');
      this.captchaError = 0;
    }

    await sleep(10000);

    return this.fetch({ endpoint, headers, body });
  }

  private request({
    endpoint,
    body,
    headers,
  }: { endpoint: string } & ApiParams): Request {
    return new Request(BASE_URL + endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...headers,
        'content-type': 'application/json; charset=utf-8',
        'user-agent': this.userAgent,
        accept: 'application/json',
        'accept-language': 'en-GB',
        'accept-encoding': 'gzip',
        ...(this.cookie && { Cookie: this.cookie }),
      },
      body: JSON.stringify(body),
    });
  }

  async loginByEmail(): Promise<ApiLogin> {
    const res = await this.fetch({
      endpoint: ENDPOINT.AUTH_BY_EMAIL,
      body: {
        device_type: DEVICE_TYPE,
        email: env.CREDENTIAL_EMAIL,
      },
    }).catch((err) => {
      console.log('Error login by email', err);
      return null;
    });

    if (!res?.ok) {
      throw new Error('Error login by email');
    }

    return JSON.parse(await res.text()) as ApiLogin;
  }

  async authPolling({
    pollingId,
  }: {
    pollingId: string;
  }): Promise<ApiAuthPolling | null> {
    const res = await this.fetch({
      endpoint: ENDPOINT.AUTH_POLLING,
      body: {
        device_type: DEVICE_TYPE,
        email: env.CREDENTIAL_EMAIL,
        request_polling_id: pollingId,
      },
    }).catch((err) => {
      console.log('Error auth polling', err);
      return null;
    });

    if (!res?.ok) {
      throw new Error('Error auth polling');
    }

    if (res.status === 200) {
      return JSON.parse(await res.text()) as ApiAuthPolling;
    }

    return null;
  }

  async refreshToken({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }): Promise<ApiRefresh> {
    const res = await this.fetch({
      endpoint: ENDPOINT.REFRESH_TOKEN,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: {
        refresh_token: refreshToken,
      },
    }).catch((err) => {
      console.log('Error refresh token', err);
      return null;
    });

    if (!res?.ok) {
      throw new Error('Error refresh token');
    }

    return JSON.parse(await res.text()) as ApiRefresh;
  }

  async getItems({
    userId,
    accessToken,
    favorite = true,
    withStock = true,
  }: {
    accessToken: string;
    userId: string;
    withStock?: boolean;
    favorite?: boolean;
  }): Promise<ApiItems> {
    const res = await this.fetch({
      endpoint: ENDPOINT.ITEM,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: {
        favorites_only: favorite,
        with_stock_only: withStock,
        origin: {
          latitude: 0.0,
          longitude: 0.0,
        },
        radius: 20,
        user_id: userId,
      },
    }).catch((err) => {
      console.log('Error get items', err);
      return null;
    });

    if (!res?.ok) {
      throw new Error('Error get items');
    }

    return JSON.parse(await res.text()) as ApiItems;
  }
}

export const apiClient = new APIClient();
