import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

/**
 * Página de inicio (Home). Pantalla de bienvenida con la mascota de Sura.
 *
 * Convención de estilos del proyecto:
 *   - Layout y utilidades → Tailwind en la plantilla (mapeado a los tokens --app-*).
 *   - Texto → clases tipográficas nombradas (.text-*).
 *   - `styles` scoped → SOLO lo que Tailwind no cubre bien: gradiente radial de la
 *     tarjeta, halo decorativo (pseudo-elemento) y la animación de flotación.
 */
@Component({
  selector: 'app-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: `
    <section class="flex justify-center px-4 py-6">
      <div
        class="grid grid-cols-1 items-center gap-6 w-full max-w-5xl p-6
               
               lg:grid-cols-[1.15fr_0.85fr] lg:p-10"
      >
        <!-- Texto -->
        <div class="flex flex-col gap-3 order-2 lg:order-1">
          <span class="text-overline text-primary-600">Plataforma domiciliaria</span>
          <h1 class="text-display-md text-text-primary m-0">
            Bienvenido a <span class="text-primary-700">Salud en Casa</span>
          </h1>
          <p class="text-body-lg text-text-secondary max-w-lg">
            Tu hogar es nuestro centro de atención. Gestiona novedades, pacientes
            y notificaciones desde un solo lugar, con el respaldo de Sura.
          </p>

          <ul class="flex flex-col gap-3 mt-3 m-0 p-0 list-none">
            <li class="flex items-center gap-3 text-text-secondary">
              <i class="inicio-ico pi pi-heart-fill" aria-hidden="true"></i>
              <span class="text-body-md">Cuidado cercano y humano</span>
            </li>
            <li class="flex items-center gap-3 text-text-secondary">
              <i class="inicio-ico pi pi-shield" aria-hidden="true"></i>
              <span class="text-body-md">Información segura y centralizada</span>
            </li>
            <li class="flex items-center gap-3 text-text-secondary">
              <i class="inicio-ico pi pi-bolt" aria-hidden="true"></i>
              <span class="text-body-md">Gestión ágil de tu día a día</span>
            </li>
          </ul>
        </div>

        <!-- Ilustración -->
        <figure class="inicio-art relative m-0 flex justify-center order-1 lg:order-2">
          <img
            ngSrc="tigre_sura.png"
            width="500"
            height="500"
            priority
            alt="Mascota de Sura dándote la bienvenida"
            class="inicio-tiger relative z-[1] w-full max-w-sm h-auto"
          />
        </figure>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    /* Gradiente radial de marca sobre la tarjeta (Tailwind no lo cubre limpio). */
    .inicio-card {
      background:
        radial-gradient(
          120% 140% at 100% 0%,
          var(--app-primary-50) 0%,
          transparent 55%
        ),
        var(--app-surface-0);
    }

    /* Chip de ícono: caso de pseudo-fondo + color de marca; lo dejamos como clase
       puntual en vez de repetir 5 utilidades por cada <i>. */
    .inicio-ico {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: var(--app-radius-full);
      background: var(--app-primary-50);
      color: var(--app-primary-600);
      font-size: 0.9rem;
    }

    /* Halo difuso detrás de la mascota (pseudo-elemento → no es utilidad). */
    .inicio-art::before {
      content: '';
      position: absolute;
      inset: 12% 8% 6% 8%;
      background: radial-gradient(
        circle,
        var(--app-primary-100) 0%,
        transparent 70%
      );
      filter: blur(4px);
      z-index: 0;
    }

    /* Sombra proyectada + flotación suave (drop-shadow custom + keyframes). */
    .inicio-tiger {
      filter: drop-shadow(0 18px 24px rgb(2 6 23 / 0.18));
      animation: inicio-float 6s ease-in-out infinite;
    }

    @keyframes inicio-float {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .inicio-tiger {
        animation: none;
      }
    }
  `,
})
export class InicioComponent {}
