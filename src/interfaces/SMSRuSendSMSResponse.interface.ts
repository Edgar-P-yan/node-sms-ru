export interface SMSRuSendSMSResponse {
  /**
   * Запрос выполнен успешно
   * (нет ошибок в авторизации, проблем с отправителем, итд...)
   */
  status: string
  /**
   * Успешный код выполнения
   */
  status_code: number
  sms: {
    [phoneNumber: string]:
      | {
          status: 'OK'
          /**
           * Успешный код выполнения, сообщение принято на отправку
           */
          status_code: number
          sms_id: string
          cost?: string
        }
      | {
          status: 'ERROR'
          /**
           * Код ошибки
           */
          status_code: number
          /**
           * Описание ошибки
           */
          status_text: string
        }
  }
  /**
   * Ваш баланс после отправки
   */
  balance: number
}
