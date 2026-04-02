import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * Servicio centralizado de almacenamiento persistente.
 *
 * Encapsula `@ionic/storage-angular` y garantiza que la instancia
 * de Storage esté creada antes de cualquier operación.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  /** Referencia a la instancia de Storage. */
  private _storage: Storage | null = null;
  /** Promesa de inicialización de la instancia de Storage. */
  private _initPromise: Promise<void> | null = null;

  /** Inyección de la instancia de Storage. */
  storage = inject(Storage);

  /**
   * Inicializa la instancia de Storage una sola vez.
   * Las llamadas posteriores reutilizan la misma promesa.
   */
  private init(): Promise<void> {
    if (!this._initPromise) {
      this._initPromise = this.storage.create().then((s) => {
        this._storage = s;
      });
    }
    return this._initPromise;
  }

  /**
   * Obtiene un valor almacenado en el almacenamiento persistente.
   * @param key - Clave del elemento a recuperar.
   * @returns El valor almacenado o `null` si no existe.
   */
  async get<T>(key: string): Promise<T | null> {
    await this.init();
    return this._storage!.get(key);
  }

  /**
   * Almacena un valor en el almacenamiento persistente.
   * @param key - Clave del elemento a almacenar.
   * @param value - Valor a almacenar.
   */
  async set(key: string, value: unknown): Promise<void> {
    await this.init();
    await this._storage!.set(key, value);
  }

  /**
   * Elimina un elemento del almacenamiento persistente.
   * @param key - Clave del elemento a eliminar.
   */
  async remove(key: string): Promise<void> {
    await this.init();
    await this._storage!.remove(key);
  }
}
