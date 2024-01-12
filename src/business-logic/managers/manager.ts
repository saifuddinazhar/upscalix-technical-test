import { PrismaClient } from "@prisma/client";

export class GetManyOption {
  public take?: number;
  public skip?: number;
  public where?: any;
};

export default class Manager {
  protected prisma: PrismaClient;
  
  constructor() {
    this.prisma = new PrismaClient();
  }
}
