export interface SMSRuSMSStatuses {
  /**
   * Запрос выполнен успешно (нет ошибок в авторизации, проблем с отправителем, итд...)
   */
  status: string;
  /**
   * Успешный код выполнения
   */
  status_code: number;
  sms: {
    [smsId: string]:
      | {
          status: 'OK';
          /**
           * Код статуса
           */
          status_code: number;
          /**
           * Стоимость
           */
          cost: number;
          /**
           * Текст статуса
           */
          status_text: string;
        }
      | {
          status: 'ERROR';
          /**
           * Код ошибки
           */
          status_code: number;
          /**
           * Описание ошибки
           */
          status_text: string;
        };
  };
  /**
   * Ваш баланс после отправки
   */
  balance: number;
}
