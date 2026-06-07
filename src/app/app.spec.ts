import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { App } from './app';
import { provideNotificaciones } from './application/di/notificaciones.providers';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // El header renderiza <app-notificaciones-badge>, que consume el
      // NotificacionesFacade (singleton root). Hay que cablear su DI igual que
      // en app.config.ts. Los hosts globales <p-toast> y <p-confirmdialog>
      // inyectan MessageService / ConfirmationService: se proveen igual.
      providers: [
        provideRouter([]),
        provideNotificaciones(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the design system link in the navigation menu', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    // El enlace "Design System" vive en el menú de navegación del drawer.
    expect(compiled.querySelector('nav')?.textContent).toContain('Design System');
  });
});
