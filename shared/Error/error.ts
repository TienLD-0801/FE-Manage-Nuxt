import { FirebaseError } from 'firebase/app';

export class CustomError implements FirebaseError {
  code: string;
  message: string;
  customData?: Record<string, unknown> | undefined;
  name: string;
  stack?: string | undefined;
  cause?: unknown;
  constructor(code: string, message: string, name: string) {
    this.code = code;
    this.message = message;
    this.name = name;
  }
}
