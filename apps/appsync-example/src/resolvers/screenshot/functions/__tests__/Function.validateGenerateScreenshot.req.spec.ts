import { render } from 'appsync-testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { regexes } from 'regex-validation';

const templateFilePath = join(__dirname, '../Function.validateGenerateScreenshot.req.vtl');
const template: string = readFileSync(templateFilePath).toString();

let context: any = {};
let substitutions: any = {};

beforeEach(() => {
    context = { args: { creative: { creativeUrl: 'www' } } };
    substitutions = {
        ...regexes,
        regxCreativeUrl: '^[a-zA-Z]{1,10}$',
        propertyRequiredError: '{0} is a required property',
        propertyNotValidError: '{0} is not a valid {1} property',
    };
});

describe('validateGenerateScreenshot.req', () => {
    it('should throw an error if creativeUrl is not provided', () => {
        context.args.creative.creativeUrl = '';
        try {
            render(template, context, substitutions);
            throw new Error('should have thrown');
        } catch (e) {
            expect(e).toMatchInlineSnapshot(
                `[["Creative Url is a required property"] on $util.error($util.toJson($errors)) at L/N 15:4]`,
            );
        }
    });

    it('should throw an error if the creativeUrl is not valid', () => {
        context.args.creative.creativeUrl = '$';

        try {
            render(template, context, substitutions);
            throw new Error('should have thrown');
        } catch (e: any) {
            expect(e).toMatchInlineSnapshot(
                `[["$ is not a valid creativeUrl property"] on $util.error($util.toJson($errors)) at L/N 15:4]`,
            );
        }
    });

    it('should return if valid', () => {
        const { result } = render(template, context, substitutions);
        expect(result).toEqual({});
    });
});
