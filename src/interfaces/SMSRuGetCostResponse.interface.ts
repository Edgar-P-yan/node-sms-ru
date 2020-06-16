export interface SMSRuGetCostResponse {
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
           * Успешный код выполнения, по сообщению возвращена стоимость
           */
          status_code: number

          /**
           * Стоимость сообщения
           */
          cost?: string

          /**
           * Количество СМС
           */
          sms: number
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
   * Общая стоимость всех сообщений
   */
  total_cost: number

  /**
   * Общее количество СМС
   */
  total_sms: number
}
