import express from 'express';
import { check } from 'express-validator';
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.post(
  '/registration',
  [
    check('username', "Username can't be empty").notEmpty(),
    check(
      'password',
      'Password must be more than 8 an UpperCase.',
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: true,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    }),
  ],
  AuthController.register,
);

router.post('/login', AuthController.login);

export default router;
