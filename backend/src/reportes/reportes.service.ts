import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
// pdfkit es CommonJS; import default funciona con transpiler
import PDFDocument from 'pdfkit';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Producto } from '../producto/entities/producto.entity';
import { ProductoTipo } from '../producto-tipo/entities/producto-tipo.entity';
import { Deposito } from '../deposito/entities/deposito.entity';
import { StockIngresado } from '../stock-ingresado/entities/stock-ingresado.entity';
import { StockEgreso } from '../stock-egreso/entities/stock-egreso.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';

/**
 * Servicio de generación de reportes.
 *
 * Proporciona métodos para construir datasets agregados
 * (stock por tipo, stock por depósito, historial de movimientos)
 * y exportarlos en formatos JSON, Excel y PDF.
 *
 * Nota: El cálculo de stock por depósito se deriva de ingresos menos egresos,
 * ya que el stockActual del producto está consolidado por producto, no por depósito.
 */
@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
    @InjectRepository(ProductoTipo) private tipoRepo: Repository<ProductoTipo>,
    @InjectRepository(Deposito) private depositoRepo: Repository<Deposito>,
    @InjectRepository(StockIngresado)
    private ingresoRepo: Repository<StockIngresado>,
    @InjectRepository(StockEgreso) private egresoRepo: Repository<StockEgreso>,
    @InjectRepository(Vehiculo) private vehiculoRepo: Repository<Vehiculo>,
  ) {}

  /**
   * Obtiene el total de stock agrupado por tipo de producto.
   * Si un producto no tiene tipo se agrupa bajo 'SIN_TIPO'.
   */
  async stockPorTipo() {
    const productos = await this.productoRepo.find({ where: { estado: 'AC' } });
    const agrupado: Record<string, number> = {};
    for (const p of productos) {
      const tipoNombre = p.tipo?.nombre || 'SIN_TIPO';
      agrupado[tipoNombre] = (agrupado[tipoNombre] || 0) + p.stockActual;
    }
    return Object.entries(agrupado).map(([tipo, total]) => ({ tipo, total }));
  }

  /**
   * Genera un archivo Excel con el stock agrupado por tipo.
   */
  async stockPorTipoExcel(): Promise<Buffer> {
    const data = await this.stockPorTipo();
    const wb = new Workbook();
    const ws = wb.addWorksheet('Stock por Tipo');
    ws.columns = [
      { header: 'Tipo', key: 'tipo', width: 30 },
      { header: 'Total', key: 'total', width: 15 },
    ];
    data.forEach((row) => {
      ws.addRow(row);
    });
    const buf = await wb.xlsx.writeBuffer();
    return Buffer.from(buf);
  }

  /**
   * Genera un PDF con el stock agrupado por tipo.
   */
  async stockPorTipoPdf(): Promise<Buffer> {
    const data = await this.stockPorTipo();
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.fontSize(18).text('Stock por Tipo', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12);
      data.forEach((r) => {
        doc.text(`${r.tipo}: ${r.total}`);
      });
      doc.end();
    });
  }

  /**
   * Calcula el stock actual agrupado por depósito.
   * Se basa en: suma(ingresos) - suma(egresos) por depósito.
   */
  async stockPorDeposito() {
    // Calcular a partir de ingresos - egresos por producto/deposito
    const ingresos = await this.ingresoRepo.find({ where: { estado: 'AC' } });
    const egresos = await this.egresoRepo.find({ where: { estado: 'AC' } });
    const mapa: Record<string, number> = {};
    for (const ing of ingresos) {
      const dep = ing.deposito?.nombre || 'SIN_DEPOSITO';
      mapa[dep] = (mapa[dep] || 0) + (ing.cantidad || 0);
    }
    for (const eg of egresos) {
      const dep = eg.deposito?.nombre || 'SIN_DEPOSITO';
      mapa[dep] = (mapa[dep] || 0) - (eg.cantidad || 0);
    }
    return Object.entries(mapa).map(([deposito, stock]) => ({
      deposito,
      stock,
    }));
  }

  /**
   * Genera un archivo Excel con el stock agrupado por depósito.
   */
  async stockPorDepositoExcel(): Promise<Buffer> {
    const data = await this.stockPorDeposito();
    const wb = new Workbook();
    const ws = wb.addWorksheet('Stock por Deposito');
    ws.columns = [
      { header: 'Deposito', key: 'deposito', width: 30 },
      { header: 'Stock', key: 'stock', width: 15 },
    ];
    data.forEach((row) => {
      ws.addRow(row);
    });
    const buf = await wb.xlsx.writeBuffer();
    return Buffer.from(buf);
  }

  /**
   * Genera un PDF con el stock agrupado por depósito.
   */
  async stockPorDepositoPdf(): Promise<Buffer> {
    const data = await this.stockPorDeposito();
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.fontSize(18).text('Stock por Depósito', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12);
      data.forEach((r) => {
        doc.text(`${r.deposito}: ${r.stock}`);
      });
      doc.end();
    });
  }

  /**
   * Devuelve el historial de movimientos (ingresos y egresos) de un producto.
   * Ordenado por fecha ascendente. Incluye datos de depósito y destino.
   */
  async historialProducto(idProducto: number) {
    const ingresos = await this.ingresoRepo.find({
      where: { estado: 'AC', producto: { id: idProducto } },
    });
    const egresos = await this.egresoRepo.find({
      where: { estado: 'AC', producto: { id: idProducto } },
    });
    type MovimientoProducto = {
      tipo: 'INGRESO' | 'EGRESO';
      fecha: string;
      cantidad: number;
      deposito?: string;
      destinoTipo?: string;
      vehiculo?: string;
    };
    const movimientos: MovimientoProducto[] = [
      ...ingresos.map(
        (i): MovimientoProducto => ({
          tipo: 'INGRESO',
          fecha: i.fechaIngreso,
          cantidad: i.cantidad,
          deposito: i.deposito?.nombre,
        }),
      ),
      ...egresos.map(
        (e): MovimientoProducto => ({
          tipo: 'EGRESO',
          fecha: e.fechaEgreso,
          cantidad: e.cantidad,
          deposito: e.deposito?.nombre,
          destinoTipo: e.destinoTipo,
          vehiculo: e.vehiculo?.dominio,
        }),
      ),
    ].sort((a, b) => a.fecha.localeCompare(b.fecha));
    return movimientos;
  }

  /**
   * Genera un Excel con el historial de movimientos de un producto.
   */
  async historialProductoExcel(idProducto: number): Promise<Buffer> {
    const data = await this.historialProducto(idProducto);
    const wb = new Workbook();
    const ws = wb.addWorksheet('Historial Producto');
    ws.columns = [
      { header: 'Tipo', key: 'tipo', width: 12 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Cantidad', key: 'cantidad', width: 12 },
      { header: 'Deposito', key: 'deposito', width: 25 },
      { header: 'DestinoTipo', key: 'destinoTipo', width: 15 },
      { header: 'Vehiculo', key: 'vehiculo', width: 15 },
    ];
    data.forEach((row) => {
      ws.addRow(row);
    });
    const buf = await wb.xlsx.writeBuffer();
    return Buffer.from(buf);
  }

  /**
   * Genera un PDF con el historial de movimientos de un producto.
   */
  async historialProductoPdf(idProducto: number): Promise<Buffer> {
    const data = await this.historialProducto(idProducto);
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.fontSize(18).text('Historial Producto', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10);
      data.forEach((r) => {
        doc.text(
          `${r.fecha} | ${r.tipo} | ${r.cantidad} | ${r.deposito ?? ''} | ${r.destinoTipo ?? ''} | ${r.vehiculo ?? ''}`,
        );
      });
      doc.end();
    });
  }

  /**
   * Devuelve el historial de egresos filtrado por tipo de destino
   * (oficina/vehiculo) y/o por idVehiculo.
   */
  async historialDestino(params: {
    destinoTipo?: string;
    idVehiculo?: number;
  }) {
    const where: FindOptionsWhere<StockEgreso> = {
      estado: 'AC',
    };
    if (params.destinoTipo) {
      where.destinoTipo = params.destinoTipo;
    }
    if (params.idVehiculo) {
      where.vehiculo = {
        idVehiculo: params.idVehiculo,
      } as FindOptionsWhere<any>;
    }
    const egresos = await this.egresoRepo.find({ where });
    type MovimientoDestino = {
      tipo: 'EGRESO';
      fecha: string;
      producto?: string;
      cantidad: number;
      deposito?: string;
      destinoTipo?: string;
      vehiculo?: string;
    };
    const movimientos: MovimientoDestino[] = egresos
      .map(
        (e): MovimientoDestino => ({
          tipo: 'EGRESO',
          fecha: e.fechaEgreso,
          producto: e.producto?.nombre,
          cantidad: e.cantidad,
          deposito: e.deposito?.nombre,
          destinoTipo: e.destinoTipo,
          vehiculo: e.vehiculo?.dominio,
        }),
      )
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
    return movimientos;
  }

  /**
   * Genera un Excel del historial filtrado por destino.
   */
  async historialDestinoExcel(params: {
    destinoTipo?: string;
    idVehiculo?: number;
  }): Promise<Buffer> {
    const data = await this.historialDestino(params);
    const wb = new Workbook();
    const ws = wb.addWorksheet('Historial Destino');
    ws.columns = [
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Producto', key: 'producto', width: 25 },
      { header: 'Cantidad', key: 'cantidad', width: 12 },
      { header: 'Deposito', key: 'deposito', width: 20 },
      { header: 'DestinoTipo', key: 'destinoTipo', width: 15 },
      { header: 'Vehiculo', key: 'vehiculo', width: 15 },
    ];
    data.forEach((row) => {
      ws.addRow(row);
    });
    const buf = await wb.xlsx.writeBuffer();
    return Buffer.from(buf);
  }

  /**
   * Genera un PDF del historial filtrado por destino.
   */
  async historialDestinoPdf(params: {
    destinoTipo?: string;
    idVehiculo?: number;
  }): Promise<Buffer> {
    const data = await this.historialDestino(params);
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.fontSize(18).text('Historial Destino', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10);
      data.forEach((r) => {
        doc.text(
          `${r.fecha} | ${r.producto} | ${r.cantidad} | ${r.deposito ?? ''} | ${r.destinoTipo ?? ''} | ${r.vehiculo ?? ''}`,
        );
      });
      doc.end();
    });
  }

  /**
   * Consulta el stock disponible por producto y depósito.
   * Devuelve un array con el detalle de cada producto en cada depósito donde tenga stock.
   */
  async stockPorProductoYDeposito() {
    try {
      const ingresos = await this.ingresoRepo.find({
        where: { estado: 'AC' },
        relations: ['producto', 'deposito'],
      });
      const egresos = await this.egresoRepo.find({
        where: { estado: 'AC' },
        relations: ['producto', 'deposito'],
      });

      // Mapa: "idProducto-idDeposito" => { producto, deposito, stock }
      const mapa: Record<
        string,
        { producto: string; deposito: string; stock: number }
      > = {};

      // Sumar ingresos
      for (const ing of ingresos) {
        if (!ing.producto || !ing.deposito) continue; // Skip si no tiene relaciones cargadas
        const key = `${ing.producto.id}-${ing.deposito.idDeposito}`;
        if (!mapa[key]) {
          mapa[key] = {
            producto: ing.producto.nombre,
            deposito: ing.deposito.nombre,
            stock: 0,
          };
        }
        mapa[key].stock += ing.cantidad || 0;
      }

      // Restar egresos
      for (const eg of egresos) {
        if (!eg.producto || !eg.deposito) continue; // Skip si no tiene relaciones cargadas
        const key = `${eg.producto.id}-${eg.deposito.idDeposito}`;
        if (!mapa[key]) {
          mapa[key] = {
            producto: eg.producto.nombre,
            deposito: eg.deposito.nombre,
            stock: 0,
          };
        }
        mapa[key].stock -= eg.cantidad || 0;
      }

      // Convertir a array y filtrar solo stocks positivos (stock disponible real)
      return Object.values(mapa)
        .filter((item) => item.stock > 0)
        .sort((a, b) => a.producto.localeCompare(b.producto));
    } catch (error) {
      console.error('Error en stockPorProductoYDeposito:', error);
      throw error;
    }
  }

  /**
   * Genera un archivo Excel con el stock por producto y depósito.
   */
  async stockPorProductoYDepositoExcel(): Promise<Buffer> {
    const data = await this.stockPorProductoYDeposito();
    const wb = new Workbook();
    const ws = wb.addWorksheet('Stock por Producto y Deposito');
    ws.columns = [
      { header: 'Producto', key: 'producto', width: 30 },
      { header: 'Depósito', key: 'deposito', width: 25 },
      { header: 'Stock', key: 'stock', width: 15 },
    ];
    data.forEach((r) => ws.addRow(r));
    const buf = await wb.xlsx.writeBuffer();
    return Buffer.from(buf);
  }

  /**
   * Genera un PDF con el stock por producto y depósito.
   */
  async stockPorProductoYDepositoPdf(): Promise<Buffer> {
    const data = await this.stockPorProductoYDeposito();
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc
        .fontSize(18)
        .text('Stock por Producto y Deposito', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10);
      data.forEach((r) => {
        doc.text(`${r.producto} | ${r.deposito} | Stock: ${r.stock}`);
      });
      doc.end();
    });
  }
}
