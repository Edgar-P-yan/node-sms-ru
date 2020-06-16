# node-sms-ru
![sms.ru logo](https://raw.githubusercontent.com/laba-do/node-sms-ru/master/assets/logo.png)

node-sms-ru это библиотека для работы с API сервиса СМС рассылок [sms.ru](https://sms.ru)

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

Сначала инициируем класс
```js
const { SMSRu } = require('node-sms-ru')

const smsRu = new SMSRu('ваш api_id')
```

Отправка СМС
```js
const sendResult = await smsRu.sendSms({
  to: '+7 000 000 00 00',
  msg: 'Hi',
  // ... описание всех опций можно найти в документации
})
```

Проверка статуса сообщений
```js
const statusResult = await smsRu.checkSmsStatuses(['id сообщения'])
```

Полное описание API находится здесь: [laba-do.github.io/node-sms-ru](https://laba-do.github.io/node-sms-ru/)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
