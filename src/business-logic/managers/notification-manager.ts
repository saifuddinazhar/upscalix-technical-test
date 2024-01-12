import { AxiosError } from "axios";
import { NotificationStatusEnum } from "../../commons/enums/notification-status-enum";
import notificationEngine from "../engines/notification-engine";
import Manager from "./manager";

export default new class NotificationManager extends Manager {
  async sendAllNotificationsInQueue() {
    const notifications = await this.prisma.notification.findMany({
      where: {
        OR: [
          { status: NotificationStatusEnum.Pending },
          { status: NotificationStatusEnum.Fail }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    for(const notification of notifications) {
      try {
        await notificationEngine.sendNotificationToEmailService(notification.apiUrl, notification.email, notification.message);
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: {
            status: NotificationStatusEnum.Sent,
          }
        })
      } catch(error) {
        let errorCode = 500;
        if(error instanceof AxiosError) {
          const axiosError = error as AxiosError;
          errorCode = axiosError.response?.status || errorCode;
        }
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: {
            status: NotificationStatusEnum.Fail,
          }
        })
      }
    }
  }
}