import axios, { AxiosError } from "axios";
import { HttpError } from "../../commons/classes/http-error";
import Engine from "./engine";
import { NotificationStatusEnum } from "../../commons/enums/notification-status-enum";

export default new class NotificationEngine extends Engine {
  async addNotificationToQueue(apiUrl: string, email: string, message: string, saveToUnsentIfFailed: boolean = true) {
    await this.prisma.notification.create({
      data: {
        apiUrl: apiUrl,
        email: email,
        message: message,
        status: NotificationStatusEnum.Pending,
        statusCode: 0,
      }
    });
  }

  async sendNotificationToEmailService(apiUrl: string, email: string, message: string) {
    const response = await axios.post(apiUrl, {
      email: email,
      message: message,
    });
    
    if(response.status !== 200) {
      throw new HttpError(response.status, JSON.stringify(response.data));
    }
  }
}
