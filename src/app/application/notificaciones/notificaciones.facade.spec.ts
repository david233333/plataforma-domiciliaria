import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificacionesFacade } from './notificaciones.facade';
import { ConsultarNotificacionesUseCase } from '../../domain/notificaciones/use-cases/consultar-notificaciones.use-case';
import { Notificacion } from '../../domain/notificaciones/entities/notificacion.entity';

describe('NotificacionesFacade', () => {
  const items: Notificacion[] = [
    { id: '1', titulo: 'A', mensaje: 'a', leida: false, fecha: new Date() },
    { id: '2', titulo: 'B', mensaje: 'b', leida: true, fecha: new Date() },
    { id: '3', titulo: 'C', mensaje: 'c', leida: false, fecha: new Date() },
  ];

  function crearFacade(): NotificacionesFacade {
    const mockUseCase = {
      execute: vi.fn().mockReturnValue(of(items)),
    } as unknown as ConsultarNotificacionesUseCase;
    TestBed.configureTestingModule({
      providers: [{ provide: ConsultarNotificacionesUseCase, useValue: mockUseCase }],
    });
    return TestBed.inject(NotificacionesFacade);
  }

  it('arranca con estado vacío', () => {
    const facade = crearFacade();
    expect(facade.items()).toEqual([]);
    expect(facade.noLeidas()).toBe(0);
  });

  it('cargar() llena items() y deriva noLeidas() con computed', () => {
    const facade = crearFacade();
    facade.cargar();
    expect(facade.items().length).toBe(3);
    expect(facade.noLeidas()).toBe(2);
  });
});
