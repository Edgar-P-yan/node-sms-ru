import { SMSRu } from '../src/node-sms-ru'
import dotenv from 'dotenv'
import { SMSRuError } from '../src/errors/SMSRuError.error'
import assert from 'assert'
import _ from 'lodash'

// load .env file into process.env
dotenv.config()

const { SMS_RU_API_ID, SMS_RU_LOGIN, SMS_RU_PASSWORD, TEST_PHONE_NUMBER } = process.env

const authArgs = SMS_RU_API_ID!
  ? ([SMS_RU_API_ID!] as const)
  : ([SMS_RU_LOGIN!, SMS_RU_PASSWORD!] as const)

/**
 * SMSRu test
 */
describe('node-sms-ru', () => {
  describe('SMSRuError', () => {
    it('SMSRuError is instantiable', () => {
      expect(new SMSRuError('msg')).toBeInstanceOf(SMSRuError)
    })

    describe('SMSRuError#isErrorResponse', () => {
      it('works', () => {
        const checkList = [
          [{}, false],
          [{ status: 'OK', status_code: 100 }, true],
          [{ status: 'OK', status_code: 100, status_text: 'text' }, true],
          [{ status: 'OK', status_code: 100, status_text: ['not a string'] }, false]
        ]

        checkList.forEach(check =>
          assert.strictEqual(SMSRuError.prototype['_isErrorResponse'](check[0]), check[1])
        )
      })
    })
  })

  describe('SMSRu', () => {
    it('SMSRu is instantiable', () => {
      // @ts-expect-error
      expect(new SMSRu(...authArgs)).toBeInstanceOf(SMSRu)
    })

    describe('SMSRu#sendSms()', () => {
      // @ts-expect-error
      const smsRu = new SMSRu(...authArgs)

      describe('#sendSms() ', () => {
        it('works', async () => {
          const result = await smsRu.sendSms({
            to: TEST_PHONE_NUMBER!,
            msg: 'Hi',
            test: true
          })

          assert.strictEqual(result.status, 'OK')
        })
      })

      describe('#checkSmsStatuses() ', () => {
        let smsId: string | undefined

        beforeAll(async () => {
          smsId = await getSmsId()
        })

        it('works', async () => {
          if (!smsId) {
            console.log(`Could not get an smsId`)
            return
          }

          const result = await smsRu.checkSmsStatuses([smsId])

          assert.strictEqual(result.status, 'OK')
        })
      })
    })

    describe('#codeCall() ', () => {
      // @ts-expect-error
      const smsRu = new SMSRu(...authArgs)

      it('works', async () => {
        const result = await smsRu.codeCall({
          to: TEST_PHONE_NUMBER!
        })

        assert.strictEqual(result.status, 'OK')
      })
    })
  })
})

async function getSmsId(): Promise<string | undefined> {
  // @ts-expect-error
  const smsRu = new SMSRu(...authArgs)

  const r = await smsRu.sendSms({
    to: TEST_PHONE_NUMBER!,
    msg: 'Hi',
    test: true
  })

  console.log(r, { depth: null, compact: true })

  const smsResult = _.values(r.sms)[0]
  return (smsResult as any)['sms_id'] as string
}
