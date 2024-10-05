import { SMSRuErrorResponse } from '../interfaces/SMSRuErrorResponse.interface';

export class SMSRuError extends Error {
  public errorResponse?: SMSRuErrorResponse;
  public response?: any;

  constructor(message: string, response?: any) {
    super(message);
    Object.setPrototypeOf(this, SMSRuError.prototype);

    this.response = response;
    this.name = this.constructor.name;

    this.response = response;
    if (this._isErrorResponse(response)) {
      this.errorResponse = response;
    }
  }

  private _isErrorResponse(response: any): response is SMSRuErrorResponse {
    return (
      (response &&
        response.status &&
        // check status_code
        response.status_code !== null &&
        response.status_code !== undefined &&
        // check status_text
        (response.status_text ? typeof response.status_text === 'string' : true)) ||
      false
    );
  }
}
