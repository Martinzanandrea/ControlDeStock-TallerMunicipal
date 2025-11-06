import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { ReportesService } from './reportes.service';
import type { Response } from 'express';

/**
 * Controlador de reportes.
 *
 * Expone endpoints para consultar y descargar reportes
 * (en JSON, Excel y PDF) sobre el stock y los historiales
 * de movimientos por producto o por destino.
 */
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  /**
   * Devuelve el total de stock agrupado por tipo de producto (JSON).
   */
  @Get('stock/tipo')
  stockPorTipo() {
    return this.reportesService.stockPorTipo();
  }

  /**
   * Descarga el reporte de stock por tipo en formato Excel.
   */
  @Get('stock/tipo.xlsx')
  async stockPorTipoExcel(@Res() res: Response) {
    const buf = await this.reportesService.stockPorTipoExcel();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="stock_por_tipo.xlsx"',
    );
    res.end(buf);
  }

  /**
   * Descarga el reporte de stock por tipo en formato PDF.
   */
  @Get('stock/tipo.pdf')
  async stockPorTipoPdf(@Res() res: Response) {
    const buf = await this.reportesService.stockPorTipoPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="stock_por_tipo.pdf"',
    );
    res.end(buf);
  }

  /**
   * Devuelve el stock actual agrupado por depósito (JSON).
   */
  @Get('stock/deposito')
  stockPorDeposito() {
    return this.reportesService.stockPorDeposito();
  }

  /**
   * Descarga el reporte de stock por depósito en Excel.
   */
  @Get('stock/deposito.xlsx')
  async stockPorDepositoExcel(@Res() res: Response) {
    const buf = await this.reportesService.stockPorDepositoExcel();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="stock_por_deposito.xlsx"',
    );
    res.end(buf);
  }

  /**
   * Descarga el reporte de stock por depósito en PDF.
   */
  @Get('stock/deposito.pdf')
  async stockPorDepositoPdf(@Res() res: Response) {
    const buf = await this.reportesService.stockPorDepositoPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="stock_por_deposito.pdf"',
    );
    res.end(buf);
  }

  /**
   * Devuelve el stock disponible por producto y depósito (JSON).
   */
  @Get('stock/producto-deposito')
  stockPorProductoYDeposito() {
    return this.reportesService.stockPorProductoYDeposito();
  }

  /**
   * Descarga el reporte de stock por producto y depósito en Excel.
   */
  @Get('stock/producto-deposito/excel')
  async stockPorProductoYDepositoExcel(@Res() res: Response) {
    const buf = await this.reportesService.stockPorProductoYDepositoExcel();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="stock_por_producto_y_deposito.xlsx"',
    );
    res.send(buf);
  }

  /**
   * Descarga el reporte de stock por producto y depósito en PDF.
   */
  @Get('stock/producto-deposito/pdf')
  async stockPorProductoYDepositoPdf(@Res() res: Response) {
    const buf = await this.reportesService.stockPorProductoYDepositoPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="stock_por_producto_y_deposito.pdf"',
    );
    res.send(buf);
  }

  /**
   * Devuelve el historial de movimientos (ingresos/egresos)
   * para un producto específico (JSON).
   */
  @Get('historial/producto/:idProducto')
  historialProducto(@Param('idProducto', ParseIntPipe) idProducto: number) {
    return this.reportesService.historialProducto(idProducto);
  }

  /**
   * Descarga el historial de un producto en Excel.
   */
  @Get('historial/producto/:idProducto/excel')
  async historialProductoExcel(
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Res() res: Response,
  ) {
    const buf = await this.reportesService.historialProductoExcel(idProducto);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="historial_producto_${idProducto}.xlsx"`,
    );
    res.send(buf);
  }

  /**
   * Descarga el historial de un producto en PDF.
   */
  @Get('historial/producto/:idProducto/pdf')
  async historialProductoPdf(
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Res() res: Response,
  ) {
    const buf = await this.reportesService.historialProductoPdf(idProducto);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="historial_producto_${idProducto}.pdf"`,
    );
    res.send(buf);
  }

  /**
   * Devuelve el historial de egresos filtrado por destino
   * (oficina/vehículo) y/o por vehículo (JSON).
   */
  @Get('historial/destino')
  historialDestino(
    @Query('destinoTipo') destinoTipo?: string,
    @Query('idVehiculo') idVehiculo?: string,
  ) {
    return this.reportesService.historialDestino({
      destinoTipo: destinoTipo || undefined,
      idVehiculo: idVehiculo ? Number(idVehiculo) : undefined,
    });
  }

  /**
   * Descarga el historial por destino en Excel.
   */
  @Get('historial/destino.xlsx')
  async historialDestinoExcel(
    @Query('destinoTipo') destinoTipo: string | undefined,
    @Query('idVehiculo') idVehiculo: string | undefined,
    @Res() res: Response,
  ) {
    const buf = await this.reportesService.historialDestinoExcel({
      destinoTipo: destinoTipo || undefined,
      idVehiculo: idVehiculo ? Number(idVehiculo) : undefined,
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="historial_destino.xlsx"`,
    );
    res.end(buf);
  }

  /**
   * Descarga el historial por destino en PDF.
   */
  @Get('historial/destino.pdf')
  async historialDestinoPdf(
    @Query('destinoTipo') destinoTipo: string | undefined,
    @Query('idVehiculo') idVehiculo: string | undefined,
    @Res() res: Response,
  ) {
    const buf = await this.reportesService.historialDestinoPdf({
      destinoTipo: destinoTipo || undefined,
      idVehiculo: idVehiculo ? Number(idVehiculo) : undefined,
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="historial_destino.pdf"`,
    );
    res.end(buf);
  }
}
