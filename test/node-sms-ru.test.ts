import { SMSRu } from "../src/node-sms-ru"

/**
 * SMSRu test
 */
describe("SMSRu test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  it("SMSRu is instantiable", () => {
    expect(new SMSRu()).toBeInstanceOf(SMSRu)
  })
})
