import axios from 'axios'
import { SMSRuParams } from './interfaces/SMSRuParams.interface'
import { SMSRuSendSMSResponse } from './interfaces/SMSRuSendSMSResponse.interface'
import { SMSRuSendSMSOptions } from './interfaces/SMSRuSendSMSOptions.interface'
import { SMSRuSMSStatuses } from './interfaces/SMSRuSMSStatuses.interface'
import { SMSRuError } from './errors/SMSRuError.error'

export class SMSRu {
  private _params: SMSRuParams

  constructor(apiId: string)
  // tslint:disable-next-line unified-signatures
  constructor(login: string, password: string)

  constructor(apiIdOrLogin: string, password?: string) {
    this._params = { baseUrl: 'https://sms.ru/' }

    if (arguments.length === 2) {
      this._params.login = apiIdOrLogin
      this._params.password = password
    } else {
      this._params.api_id = apiIdOrLogin
    }
  }

  /**
   * Отправить СМС сообщение
   * @param options
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
      test: options.test ? 1 : options.test === false ? 0 : undefined
    }

    const sendResponse = await this._makeApiRequest<SMSRuSendSMSResponse>('sms/send', params)

    return sendResponse
  }

  /**
   * Проверить статус отправленных сообщений
   * @param smsIds
   */
  async checkSmsStatuses(smsIds: string | string[]): Promise<SMSRuSMSStatuses> {
    const smsStatuses = await this._makeApiRequest<SMSRuSMSStatuses>('sms/status', {
      sms_id: Array.isArray(smsIds) ? smsIds.join(',') : smsIds
    })

    return smsStatuses
  }

  private async _makeApiRequest<T = any>(path: string, params: Record<string, any>): Promise<T> {
    const response = await axios.request<T>({
      url: path,
      params: {
        ...params,
        ...this._authParams,
        json: 1
      },
      baseURL: this._params.baseUrl
    })

    if ((response.data as any)?.status !== 'OK') {
      throw new SMSRuError((response.data as any)?.status_text || 'Unknown error', response.data)
    }

    return response.data
  }

  private get _authParams() {
    return this._params.api_id
      ? { api_id: this._params.api_id }
      : { login: this._params.login, password: this._params.password }
  }
}
