import userManager from "../business-logic/managers/user-manager";

export default new class BirthdayJob {
  sendNotifications() {
    console.log("Job started, send birthday message to users");
    userManager.sendBirthdayMessages(9, 0);
  }
}