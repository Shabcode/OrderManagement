import { APP_INITIALIZER, ApplicationConfig, isDevMode, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTheming, themingInitializer } from '@fundamental-ngx/core/theming';
import { ContentDensityMode, DATE_TIME_FORMATS, DatetimeAdapter, provideContentDensity } from '@fundamental-ngx/core';
import { provideHttpClient } from '@angular/common/http';
import { DAYJS_DATETIME_FORMATS, DayjsDatetimeAdapter } from '@fundamental-ngx/datetime-adapter';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { FD_LANGUAGE, FD_LANGUAGE_GERMAN, FdLanguage } from '@fundamental-ngx/i18n';
import { of } from 'rxjs';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withComponentInputBinding(), withHashLocation()),
        provideAnimations(),
        provideTheming({ defaultTheme: 'sap_horizon', changeThemeOnQueryParamChange: false }),
        provideContentDensity({
            defaultGlobalContentDensity: ContentDensityMode.COZY,
            storage: 'memory',
        }),
        themingInitializer(),
        provideHttpClient(),
        {
            provide: LOCALE_ID,
            useValue: 'de',
        },
        {
            provide: DatetimeAdapter,
            useClass: DayjsDatetimeAdapter,
        },
        {
            provide: DATE_TIME_FORMATS,
            useValue: DAYJS_DATETIME_FORMATS,
        },
        provideTransloco({
            config: {
                availableLangs: ['de'],
                defaultLang: 'de',
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                prodMode: !isDevMode(),
            },
            loader: TranslocoHttpLoader,
        }),
        {
            provide: FD_LANGUAGE,
            useValue: of<FdLanguage>(FD_LANGUAGE_GERMAN),
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (transloco: TranslocoService) => () => transloco.selectTranslation('de'), // force loading i18n files on app initialization
            deps: [TranslocoService],
            multi: true,
        },
    ],
};
