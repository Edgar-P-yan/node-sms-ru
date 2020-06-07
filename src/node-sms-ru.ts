import axios from 'axios'
import { SMSRuParams } from './interfaces/SMSRuParams.interface'
import { SMSRuSendSMSResponse } from './interfaces/SMSRuSendSMSResponse.interface'
import { SMSRuSendSMSOptions } from './interfaces/SMSRuSendSMSOptions.interface'
import { SMSRuSMSStatuses } from './interfaces/SMSRuSMSStatuses.interface'
import { SMSRuErrorResponse } from './interfaces/SMSRuErrorResponse'
import { SMSRuError } from './errors/SMSRuError.error'

export class SMSRu {
  private params: SMSRuParams

  constructor(apiId: string)
  // tslint:disable-next-line unified-signatures
  constructor(login: string, password: string)

  constructor(apiIdOrLogin: string, password?: string) {
    this.params = { baseUrl: 'https://sms.ru/' }

    if (arguments.length === 2) {
      this.params.login = apiIdOrLogin
      this.params.password = password
    } else {
      this.params.api_id = apiIdOrLogin
    }
  }

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

    const sendResponse = await this.makeApiRequest<SMSRuSendSMSResponse>('sms/send', params)

    return sendResponse
  }

  async checkSmsStatuses(smsIds: string | string[]): Promise<SMSRuSMSStatuses> {
    const smsStatuses = await this.makeApiRequest<SMSRuSMSStatuses>('sms/status', {
      sms_id: Array.isArray(smsIds) ? smsIds.join(',') : smsIds
    })

    return smsStatuses
  }

  private async makeApiRequest<T = any>(path: string, params: Record<string, any>): Promise<T> {
    const response = await axios.request<T>({
      url: path,
      params: {
        ...params,
        ...this.authParams,
        json: 1
      },
      baseURL: this.params.baseUrl
    })

    if ((response.data as any)?.status !== 'OK') {
      throw new SMSRuError((response.data as any)?.status_text || 'Unknown error', response.data)
    }

    return response.data
  }

  private get authParams() {
    return this.params.api_id
      ? { api_id: this.params.api_id }
      : { login: this.params.login, password: this.params.password }
  }
}
