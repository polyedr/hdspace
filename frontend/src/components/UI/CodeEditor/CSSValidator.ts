// @ts-nocheck
import validateCSS from 'simple-css-validator';
import { ValidationError, Validator } from './validator';

export default class CSSValidator implements Validator {
  private static readonly errorRegex = /'[^\\']*(\\'[^\\']*)*'/g;

  // eslint-disable-next-line class-methods-use-this
  validate(value: string): ValidationError[] {
    try {
      const stylesJson = value
        .replaceAll('\r', '')
        .replaceAll('\n', '')
        .split(';')
        .reduce((json, styleRule) => {
          if (!styleRule.trim().length) {
            return json;
          }
          const [ruleName, ruleValue, ...otherValues] = styleRule.split(':');
          if (!ruleName || !ruleValue || otherValues.length) {
            throw new Error(
              `Invalid CSS input: '${styleRule.replaceAll('\n', '')}'`,
            );
          }
          return {
            ...json,
            [ruleName.trim()]: ruleValue.trimLeft(),
          };
        }, {});
      const validationResult = validateCSS({ ...stylesJson });
      if (!validationResult.valid) {
        return validationResult.error.map(
          (error) =>
            ({
              keyPart: this.getKeyPart(error),
              message: error,
            } as ValidationError),
        );
      }
    } catch (e) {
      const keyPart = this.getKeyPart(e.message);
      if (!keyPart.length) {
        throw e;
      }
      return [
        {
          keyPart,
          message: e.message,
        } as ValidationError,
      ];
    }
    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  private getKeyPart(error: string) {
    const result = error.match(CSSValidator.errorRegex);
    if (!result?.length) {
      return '';
    }
    return result[0].replaceAll("'", '');
  }
}
