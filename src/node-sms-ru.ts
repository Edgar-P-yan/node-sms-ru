import axios from 'axios';
import { SMSRuParams } from './interfaces/SMSRuParams.interface';
import { SMSRuSendSMSResponse } from './interfaces/SMSRuSendSMSResponse.interface';
import { SMSRuSendSMSOptions } from './interfaces/SMSRuSendSMSOptions.interface';
import { SMSRuSMSStatuses } from './interfaces/SMSRuSMSStatuses.interface';
import { SMSRuError } from './errors/SMSRuError.error';
import { SMSRuGetCostOptions } from './interfaces/SMSRuGetCostOptions.interface';
import { SMSRuGetCostResponse } from './interfaces/SMSRuGetCostResponse.interface';
import { SMSRuGetBalanceResponse } from './interfaces/SMSRuGetBalanceResponse.interface';
import { SMSRuGetLimitResponse } from './interfaces/SMSRuGetLimitResponse.interface';
import { SMSRuGetFreeResponse } from './interfaces/SMSRuGetFreeResponse.interface';
import { SMSRuGetSendersResponse } from './interfaces/SMSRuGetSendersResponse.interface';
import { SMSRuCodeCallOptions } from './interfaces/SMSRuCodeCallOptions.interface';
import { SMSRuCodeCallResponse } from './interfaces/SMSRuCodeCallResponse.interface';
export { SMSRuErrorResponse } from './interfaces/SMSRuErrorResponse.interface';

export class SMSRu {
  private _params: SMSRuParams;

  constructor(apiId: string);
  // tslint:disable-next-line unified-signatures
  constructor(login: string, password: string);

  constructor(apiIdOrLogin: string, password?: string) {
    this._params = { baseUrl: 'https://sms.ru/' };

    if (password !== undefined && password !== null) {
      this._params.login = apiIdOrLogin;
      this._params.password = password;
    } else {
      this._params.api_id = apiIdOrLogin;
    }
  }

  /**
   * Отправить СМС сообщение
   *
   * Если у вас есть необходимость в отправке СМС
   * сообщения из вашей программы, то вы можете
   * использовать этот метод.
   *
   * @see http://sms.ru/api/send
   */
  async sendSms(options: SMSRuSendSMSOptions): Promise<SMSRuSendSMSResponse> {
    const params = {
      ...options,
      to: Array.isArray(options.to) ? options.to.join(',') : options.to,
      time: !options.time
        ? undefined
        : options.time instanceof Date
        ? options.time.valueOf()
        : typeof options.time === 'string'
        ? new Date(options.time).valueOf()
        : options.time,
      daytime: options.daytime ? 1 : options.daytime === false ? 0 : undefined,
      transit: options.transit ? 1 : options.transit === false ? 0 : undefined,
      test: options.test ? 1 : options.test === false ? 0 : undefined,
    };

    const sendResponse = await this._makeApiRequest<SMSRuSendSMSResponse>('sms/send', params);

    return sendResponse;
  }

  /**
   * Отправить четырехзначный авторизационный код звонком
   *
   * @see https://sms.ru/api/code_call
   */
  async codeCall(options: SMSRuCodeCallOptions): Promise<SMSRuCodeCallResponse> {
    const params = { phone: options.to };
    return this._makeApiRequest<SMSRuCodeCallResponse>('code/call', params);
  }

  /**
   * Проверить статус отправленных сообщений
   *
   * Если у вас есть необходимость вручную проверить
   * статус отправленных вами сообщений, то вы
   * можете использовать этот метод.
   *
   * @see http://sms.ru/api/status
   */
  async checkSmsStatuses(smsIds: string | string[]): Promise<SMSRuSMSStatuses> {
    const smsStatuses = await this._makeApiRequest<SMSRuSMSStatuses>('sms/status', {
      sms_id: Array.isArray(smsIds) ? smsIds.join(',') : smsIds,
    });

    return smsStatuses;
  }

  /**
   * Проверить стоимость сообщений перед отправкой.
   *
   * Если у вас есть необходимость проверить стоимость сообщения
   * перед его отправкой из вашей программы,
   * то вы можете использовать этот метод.
   *
   * @see http://sms.ru/api/cost
   */
  async getCost(options: SMSRuGetCostOptions): Promise<SMSRuGetCostResponse> {
    const params = {
      ...options,
      to: Array.isArray(options.to) ? options.to.join(',') : options.to,
      transit: options.transit ? 1 : options.transit === false ? 0 : undefined,
    };

    return this._makeApiRequest<SMSRuGetCostResponse>('sms/cost', params);
  }

  /**
   * Получить информацию о балансе
   *
   * Если вы хотите узнать ваш текущий баланс на сайте SMS.RU,
   * используйте этот метод.
   */
  async getBalance(): Promise<number> {
    const getBalanceResponse = await this._makeApiRequest<SMSRuGetBalanceResponse>('my/balance');
    return getBalanceResponse.balance;
  }

  /**
   * Получить информацию о дневном лимите и его использовании
   *
   * Если вы хотите узнать какой у вас лимит на отправку
   * сообщений и на какое количество номеров вы уже
   * сегодня отправили сообщения, используйте этот метод.
   */
  async getLimit(): Promise<SMSRuGetLimitResponse> {
    return this._makeApiRequest<SMSRuGetLimitResponse>('my/limit');
  }

  /**
   * Получить информацию о бесплатных сообщениях и его
   * использовании.
   *
   * Если вы хотите узнать ваш расход бесплатных
   * сообщений на свой номер за день, используйте этот метод.
   */
  async getFree(): Promise<SMSRuGetFreeResponse> {
    return this._makeApiRequest<SMSRuGetFreeResponse>('my/free');
  }

  /**
   * Получение списка одобренных отправителей
   *
   * Если вы хотите получить список отправителей, которые
   * были согласованы вами на сайте SMS.RU,
   * то необходимо использовать этот метод
   */
  async getSenders(): Promise<string[]> {
    const getSendersResponse = await this._makeApiRequest<SMSRuGetSendersResponse>('my/senders');
    return getSendersResponse.senders;
  }

  /**
   * Проверить на валидность пару логин/пароль (или api_id).
   *
   * Если вы хотите проверить, является ли рабочим ваш api_id
   * или логин и пароль, используйте этот метод.
   *
   * Если вам api_id или логин и пароль работают - метод ничего не вернет,
   * иначе выбросит исключение.
   */
  async checkAuth(): Promise<void> {
    await this._makeApiRequest('auth/check');
  }

  private async _makeApiRequest<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    const response = await axios.request<T>({
      url: path,
      params: {
        ...(params || {}),
        ...this._authParams,
        json: 1,
      },
      baseURL: this._params.baseUrl,
    });

    if ((response.data as any)?.status !== 'OK') {
      throw new SMSRuError((response.data as any)?.status_text || 'Unknown error', response.data);
    }

    return response.data;
  }

  private get _authParams() {
    return this._params.api_id
      ? { api_id: this._params.api_id }
      : { login: this._params.login, password: this._params.password };
  }
}

export {
  SMSRuSendSMSOptions,
  SMSRuSendSMSResponse,
  SMSRuSMSStatuses,
  SMSRuGetCostOptions,
  SMSRuGetCostResponse,
  SMSRuGetLimitResponse,
  SMSRuGetFreeResponse,
  SMSRuError,
};
