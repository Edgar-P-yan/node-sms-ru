# node-sms-ru

![sms.ru logo](https://raw.githubusercontent.com/Edgar-P-yan/node-sms-ru/master/assets/logo.png)

node-sms-ru это библиотека для работы с API сервиса СМС рассылок [sms.ru](https://sms.ru).

## Installation

Используйте пакетный менеджер для установки node-sms-ru:

С помощью npm:

```bash
npm install --save node-sms-ru
```

Или же с помощью yarn:

```bash
yarn add node-sms-ru
```

## Usage

Сначала инициируем класс:

```js
const { SMSRu } = require('node-sms-ru')

const smsRu = new SMSRu('ваш api_id')
```

Отправка СМС:

```js
const sendResult = await smsRu.sendSms({
  to: '+7 000 000 00 00',
  msg: 'Hi'
  // ... описание всех опций можно найти в документации
})
```

Проверка статуса сообщений:

```js
const statusResult = await smsRu.checkSmsStatuses(['id сообщения'])
```

Полное описание API находится здесь: [edgar-p-yan.github.io/node-sms-ru](https://edgar-p-yan.github.io/node-sms-ru/)

### Nest.js integration

В модуль встроена интеграция с фреймворком Nest.js.

```ts
import { SMSRuModule } from 'node-sms-ru/nestjs'

@Module({
  imports: [SMSRuModule.forRoot({ api_id: 'ваш api_id' })]
})
export class AppModule {}
```

Или через `.forRootAsync()`

```ts
import { SMSRuModule } from 'node-sms-ru/nestjs'

@Module({
  imports: [
    SMSRuModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        api_id: config.get('SMS_RU_API_ID')
      }),
      inject: [ConfigService]
    })
  ]
})
export class AppModule {}
```

А после этого используем его в сервисах

```ts
import { SMSRu } from 'node-sms-ru'

@Injectable()
export class AppService {
  constructor(private readonly smsRu: SMSRu) {}

  async sendSMSNotification(to: string, msg: string): Promise<void> {
    await this.smsRu.sendSms({ to, msg })
  }
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
