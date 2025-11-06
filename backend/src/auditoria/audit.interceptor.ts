import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditoriaService } from './auditoria.service';

/**
 * Interceptor global de auditoría.
 * Captura los datos de cada petición (usuario, método, ruta, params, body) y los registra.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditoria: AuditoriaService) {}

  /** Intercepta la petición y en el stream final persiste el log */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<
      Request & {
        user?: unknown;
        route?: { path?: string };
        path?: string;
        baseUrl?: string;
        originalUrl?: string;
        params?: Record<string, unknown>;
        query?: Record<string, unknown>;
        body?: Record<string, unknown>;
      }
    >();

    const method = String(req.method || '');
    const path = (req.route?.path as string) || (req.path as string) || '';
    const baseUrl = (req.baseUrl as string) || '';
    const route = `${baseUrl}${path}` || (req.originalUrl as string) || '';
    const params: Record<string, unknown> | null = req.params || null;
    const query: Record<string, unknown> | null = req.query || null;
    const bodyRaw: Record<string, unknown> | null = req.body || null;

    const action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' =
      method === 'POST'
        ? 'CREATE'
        : method === 'PUT' || method === 'PATCH'
          ? 'UPDATE'
          : method === 'DELETE'
            ? 'DELETE'
            : 'READ';

    // Solo registrar operaciones de escritura (CREATE, UPDATE, DELETE)
    const shouldAudit = ['CREATE', 'UPDATE', 'DELETE'].includes(action);
    if (!shouldAudit) {
      return next.handle();
    }

    // Sanear body: quitar campos sensibles
    const sensitive = new Set([
      'password',
      'pass',
      'contrasena',
      'token',
      'access_token',
    ]);
    const body = bodyRaw
      ? Object.fromEntries(
          Object.entries(bodyRaw).map(([k, v]) => [
            k,
            sensitive.has(k.toLowerCase()) ? '[REDACTED]' : v,
          ]),
        )
      : null;

    const resourcePart = route.split('/').filter(Boolean)[0];
    const resource: string | null = resourcePart ? String(resourcePart) : null;
    const entityId =
      params &&
      (params.id || params.idProducto || params.idDeposito || params.idVehiculo)
        ? String(
            params.id ??
              params.idProducto ??
              params.idDeposito ??
              params.idVehiculo,
          )
        : null;

    interface MinimalUser {
      id?: number;
      userId?: number;
      username?: string;
    }
    const userObj: MinimalUser =
      req.user && typeof req.user === 'object' ? (req.user as MinimalUser) : {};
    const userId: number | null =
      typeof userObj.id === 'number'
        ? userObj.id
        : typeof userObj.userId === 'number'
          ? userObj.userId
          : null;
    const username: string | null =
      typeof userObj.username === 'string' ? userObj.username : null;

    return next.handle().pipe(
      tap(() => {
        void this.auditoria.log({
          userId,
          username,
          method,
          action,
          route,
          resource,
          entityId,
          params,
          query,
          body: body || null,
        });
      }),
    );
  }
}
