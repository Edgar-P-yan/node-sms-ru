export interface SMSRuCodeCallResponse {
  /**
   * Запрос выполнен успешно
   * (нет ошибок в авторизации, проблем с отправителем, итд...)
   */
  status: string;
  /**
   * Успешный код выполнения
   */
  code: number;
  call_id: number;
  cost: number;
  /**
   * Ваш баланс после отправки
   */
  balance: number;
}
