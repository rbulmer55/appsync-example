import { render } from 'appsync-testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { regexes } from 'regex-validation';

const templateFilePath = join(__dirname, '../Function.recordScreenshotJob.res.vtl');
const template: string = readFileSync(templateFilePath).toString();

let context: any = {};
let substitutions: any = {};

beforeEach(() => {
    context = { result: { pk: 'pk-uuid' } };
    substitutions = {
        ...regexes,
        regxCreativeUrl: '^[a-zA-Z]{1,10}$',
        propertyRequiredError: '{0} is a required property',
        propertyNotValidError: '{0} is not a valid {1} property',
    };
});

describe('recordScreenshot.res', () => {
    it('should return mapping the pk to jobId', () => {
        const { result } = render(template, context, substitutions);
        expect(result).toEqual({ jobId: 'pk-uuid', pk: 'pk-uuid' });
    });
});
