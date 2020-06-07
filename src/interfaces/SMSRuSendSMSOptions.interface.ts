export interface SMSRuSendSMSOptions {
  to: string | string[] | { [phoneNumber: string]: string }
  msg?: string
  from?: string
  ip?: string
  time?: number | string | Date
  ttl?: number
  daytime?: boolean
  transit?: boolean
  test?: boolean
  partner_id?: number | string
}
