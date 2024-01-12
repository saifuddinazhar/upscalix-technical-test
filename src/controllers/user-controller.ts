import { Request, Response} from 'express';
import asyncMw from "async-express-mw"
import * as yup from 'yup';
import _ from 'lodash';
import moment from 'moment-timezone';
import userManager from '../business-logic/managers/user-manager';
import { HttpError } from '../commons/classes/http-error';
import { UserDateTypeEnum } from '../commons/enums/user-date-type-enum';

export default new class UserController {
  post = asyncMw(async (req: Request, res: Response) => {
    try {
      let schema = yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string(),
        email: yup.string().email().required(),
        location: yup.string().required(),
        birthday: yup.date(),
      });

      await schema.validate(req.body);

      if(!moment.tz.names().find(e => e === req.body.location)) {
        throw new HttpError(400, 'Invalid location, please visit https://momentjs.com/timezone to get location list');
      }
    } catch(error: any) {
      throw new HttpError(400, error.message);
    }

    const newUserJson = { ... req.body, birthday: undefined}
    if(req.body.birthday) {
      newUserJson.dates = [{
        type: UserDateTypeEnum.Birthday,
        date: new Date(req.body.birthday)
      }];
    }

    const user = await userManager.createUser(newUserJson);
    res.status(200).send(user)
  })

  put = asyncMw(async (req: Request, res: Response) => {
    try {
      let schema = yup.object().shape({
        firstName: yup.string(),
        lastName: yup.string(),
        email: yup.string().email(),
        location: yup.string(),
        birthday: yup.date(),
      });

      await schema.validate(req.body);

      if(req.body.location && !moment.tz.names().find(e => e === req.body.location)) {
        throw new HttpError(400, 'Invalid location, please visit https://momentjs.com/timezone to get location list');
      }
    } catch(error: any) {
      throw new HttpError(400, error.message);
    }

    const newUserJson = { ... req.body, birthday: undefined}
    if(req.body.birthday) {
      newUserJson.dates = [{
        type: UserDateTypeEnum.Birthday,
        date: new Date(req.body.birthday)
      }];
    }
    const user = await userManager.updateUser(Number(req.params.id), newUserJson);
    res.status(200).send(user);
  });

  deleteById = asyncMw(async (req: Request, res: Response) => {
    if(_.isNil(req.params.id)) {
      throw new HttpError(400, 'id is required');
    }
    await userManager.deleteUser(Number(req.params.id))
    res.status(200).send()
  })
}