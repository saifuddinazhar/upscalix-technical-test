import Engine from "./engine";

export default new class Setting extends Engine {
  async getSettingDate(key: string, defaultValue : Date | undefined = undefined) {
    const setting = await this.prisma.setting.findFirst({
      where: {
        key: key,
      }
    });

    if(!setting) {
      return undefined;
    }

    return new Date(setting.value);
  }

  async setSettingDate(key: string, value: Date) {
    const setting = await this.prisma.setting.findFirst({ where: { key: key, } });
    if(setting) {
      await this.prisma.setting.update({
        where: {
          id: setting.id,
        },
        data: {
          value: value.toISOString(),
        }
      });
    } else  {
      await this.prisma.setting.create({
        data: {
          key: key,
          value: value.toISOString(),
        }
      });
    }
    
    
    
  }
}