export class HttpResponse {
  /** Result of the request **/
  success: boolean;
  /** Return data if success = true **/
  data?: any;
  /* Description of errors if success = false */
  errors?: any[];

  constructor(success: boolean, data?: any, errors?: any[]) {
    this.success = success;
    this.data = data;
    this.errors = errors;
  }

}
