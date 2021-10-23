import { generateRegexList } from '../generate-regex-list';

const testObject = {
    sharedUUID: '1234',
    screenshot: {
        jobId: '1234',
    },
};

describe('generateRegexList', () => {
    it('should generate a list of regexes', () => {
        const result = generateRegexList(testObject);
        expect(result).toMatchInlineSnapshot(`
Object {
  "jobId": "1234",
  "sharedUUID": "1234",
}
`);
    });
});
