import { PrismaClient } from "@prisma/client";

export default class Engine {
  protected prisma: PrismaClient;
  
  constructor() {
    this.prisma = new PrismaClient();
  }
}
