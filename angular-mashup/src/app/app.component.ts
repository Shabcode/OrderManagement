import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SuccessResponse } from './shared/response.interface';
import { BACKEND_ODATA_ENDPOINT } from './shared/constants';
import { AsyncPipe } from '@angular/common';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

const GREETING_URL = `${BACKEND_ODATA_ENDPOINT}/sayHello`;

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, AsyncPipe, TranslocoDirective],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private httpClient = inject(HttpClient);
    private translocoService = inject(TranslocoService);

    protected greeting = new BehaviorSubject<string>('');

    public ngOnInit() {
        this.loadGreeting('cronos developer').subscribe(greeting => this.greeting.next(greeting));
    }

    public loadGreeting(name: string): Observable<string> {
        return this.httpClient.get<SuccessResponse<string>>(`${GREETING_URL}(name='${name}')`).pipe(
            map(response => response.value),
            catchError(() => this.translocoService.selectTranslate('dummy.backend-error')),
        );
    }
}
