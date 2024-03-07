import * as validators from '@vuelidate/validators';
const {createI18nMessage} = validators;
import {i18n} from "@/components/I18n";
export {yup} from "./yup";
const withI18nMessage = createI18nMessage({t: i18n.global.t.bind(i18n), messagePath: (prop) => {return `_validator_messages_.${prop.$validator}`}})
export const required = withI18nMessage(validators.required);
export const maxLength = withI18nMessage(validators.maxLength, {withArguments: true});
export const minLength = withI18nMessage(validators.minLength, {withArguments: true});
export const email = withI18nMessage(validators.email);
export const sameAs = withI18nMessage(validators.sameAs, {withArguments: true});
