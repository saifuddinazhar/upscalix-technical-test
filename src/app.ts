import express from 'express';
import _ from 'lodash';
import route from './routes';
import birthdayJob from './jobs/birthday-job';
import notificationManager from './business-logic/managers/notification-manager';
const cron = require('node-cron');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(express.json());
app.use(route)

app.use((err: any, req: any, res: any, next: any) => {
  if(_.isNil(err.statusCode)) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
});

cron.schedule('0/30 * * * *', birthdayJob.sendNotifications);

(async () => {
  while(true) {
    await notificationManager.sendAllNotificationsInQueue();
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
})();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
