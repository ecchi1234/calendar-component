import i18next, {TFunction} from 'i18next';
import {initReactI18next} from 'react-i18next';
import nameof from 'ts-nameof.macro';
import vi from '../i18n/vi.json';
import en from '../i18n/en.json';

/**
 * Handle app translation
 */
export class AppTranslation {
  protected translator?: TFunction;

  /**
   * Initialize translation service
   */
  public async initialize(): Promise<void> {
    await i18next
      .use(initReactI18next)
      .init({
        lng: nameof(vi),
        fallbackLng: nameof(vi),
        ns: '',
        defaultNS: '',
      })
      .then((translate) => {
        this.translator = translate;
      });

    i18next.addResources(nameof(vi), '', vi);
    i18next.addResources(nameof(en), '', en);
  }

  /**
   * Call translate function
   *
   * @param key {string}
   * @param params
   */
  public translate: TFunction = (key: string, ...params: any[]): string => {
    if (typeof this.translator === 'function') {
      return this.translator(key, ...params);
    }

    return key;
  };
}

export const appTranslation: AppTranslation = new AppTranslation();