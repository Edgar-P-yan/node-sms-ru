import { Module, DynamicModule, Global } from '@nestjs/common';
import { SMSRu } from './node-sms-ru';
import { ModuleMetadata } from '@nestjs/common/interfaces';

const SMS_RU_NEST_MODULE_OPTIONS_PROVIDER = 'SMS_RU_NEST_MODULE_OPTIONS_PROVIDER';

export interface SMSRuNestModuleOptions {
  api_id?: string;
  login?: string;
  password?: string;
}

export interface SMSRuNestModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory: (...args: any[]) => Promise<SMSRuNestModuleOptions> | SMSRuNestModuleOptions;
  inject?: any[];
}

@Global()
@Module({})
export class SMSRuModule {
  static forRoot(options: SMSRuNestModuleOptions): DynamicModule {
    return {
      module: SMSRuModule,
      global: true,
      providers: [
        {
          provide: SMSRu,
          useValue: this._createSMSRu(options),
        },
      ],
      exports: [SMSRu],
    };
  }

  static forRootAsync(options: SMSRuNestModuleAsyncOptions): DynamicModule {
    return {
      module: SMSRuModule,
      global: true,
      imports: options.imports,
      providers: [
        {
          provide: SMS_RU_NEST_MODULE_OPTIONS_PROVIDER,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: SMSRu,
          useFactory: async (options: SMSRuNestModuleOptions): Promise<SMSRu> => {
            return this._createSMSRu(options);
          },
          inject: [SMS_RU_NEST_MODULE_OPTIONS_PROVIDER],
        },
      ],
      exports: [SMSRu],
    };
  }

  private static _createSMSRu(options: SMSRuNestModuleOptions): SMSRu {
    return options.api_id
      ? new SMSRu(options.api_id)
      : new SMSRu(options.login!, options.password!);
  }
}
