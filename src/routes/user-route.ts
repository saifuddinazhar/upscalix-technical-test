import express from 'express';
import userController from "../controllers/user-controller";

const router = express.Router();

router.post('/', userController.post);
router.delete('/:id', userController.deleteById);

export default router;