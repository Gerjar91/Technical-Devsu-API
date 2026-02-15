import "reflect-metadata";
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  Params,
  QueryParam,
  NotFoundError,
  BadRequestError,
} from "routing-controllers";
import { ProductDTO } from "../dto/Product";
import { MESSAGE_ERROR } from "../const/message-error.const";
import { ProductInterface } from "../interfaces/product.interface";

const MOCK_PRODUCTS: ProductInterface[] = [
  { id: "001", name: "Cuenta de Ahorros Premium", description: "Cuenta de ahorros con rendimientos competitivos y sin comisiones por manejo.", logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg", date_release: new Date("2026-06-10"), date_revision: new Date("2027-06-10") },
  { id: "002", name: "Tarjeta de Crédito Gold", description: "Tarjeta de crédito con beneficios en viajes y cashback en compras nacionales.", logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg", date_release: new Date("2026-07-01"), date_revision: new Date("2027-07-01") },
  { id: "003", name: "Préstamo Personal Express", description: "Préstamo de consumo con desembolso en 24 horas y tasas preferenciales.", logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg", date_release: new Date("2026-07-15"), date_revision: new Date("2027-07-15") },
  { id: "004", name: "Seguro de Vida Familiar", description: "Cobertura de vida para el grupo familiar con beneficios adicionales.", logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg", date_release: new Date("2026-08-01"), date_revision: new Date("2027-08-01") },
  { id: "005", name: "Fondo de Inversión Moderado", description: "Fondo de inversión con perfil riesgo moderado y liquidez diaria.", logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg", date_release: new Date("2026-08-15"), date_revision: new Date("2027-08-15") },
  { id: "006", name: "Hipoteca Verde", description: "Crédito hipotecario con tasas preferenciales para vivienda sostenible.", logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg", date_release: new Date("2026-09-01"), date_revision: new Date("2027-09-01") },
  { id: "007", name: "Cuenta Corriente Empresas", description: "Cuenta corriente para pymes con línea de sobregiro y banca en línea.", logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg", date_release: new Date("2026-09-15"), date_revision: new Date("2027-09-15") },
  { id: "008", name: "CDT Digital", description: "Certificado de depósito a término con renovación automática y tasa fija.", logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg", date_release: new Date("2026-10-01"), date_revision: new Date("2027-10-01") },
  { id: "009", name: "Leasing Vehicular", description: "Leasing para vehículos nuevos y usados con opción de compra al final.", logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg", date_release: new Date("2026-10-15"), date_revision: new Date("2027-10-15") },
  { id: "010", name: "Billetera Digital", description: "App de pagos y transferencias instantáneas con cashback en comercios.", logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg", date_release: new Date("2026-11-01"), date_revision: new Date("2027-11-01") },
];

@JsonController("/products")
export class ProductController {
  products: ProductInterface[] = [...MOCK_PRODUCTS];

  @Get("")
  getAll(@QueryParam("search") search?: string) {
    const items = [...this.products];
    if (search && search.trim().length >= 3) {
      return {
        data: items.filter((p) =>
          p.name.toLowerCase().includes(search.trim().toLowerCase())
        ),
      };
    }
    return { data: items };
  }

  @Get("/verification/:id")
  verifyIdentifier(@Param("id") id: number | string) {
    return this.products.some((product) => product.id === id);
  }

  @Get("/:id")
  getOne(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
    return this.products.find((product) => product.id === id);
  }

  @Post("")
  createItem(@Body({ validate:true }) productItem: ProductDTO) {
    
    const index = this.findIndex(productItem.id);

    if(index !== -1) {
      throw new BadRequestError(MESSAGE_ERROR.DuplicateIdentifier);
    }
    
    this.products.push({...productItem, logo: this.products[0].logo});
    return {
      message: "Product added successfully",
      data: productItem,
    };
  }

  @Put("/:id")
  put(@Param("id") id: number | string, @Body() productItem: ProductInterface) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    this.products[index] = {
      ...this.products[index],
      ...productItem,
    };
    return {
      message: "Product updated successfully",
      data: productItem,
    };
  }

  @Delete("/:id")
  remove(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
        
    this.products = [...this.products.filter((product) => product.id !== id)];
    return {
      message: "Product removed successfully",
    };
  }

  private findIndex(id: number | string) {
    return this.products.findIndex((product) => product.id === id);
  }

}
