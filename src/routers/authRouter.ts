import { Router } from 'express';
import { check } from 'express-validator';
import AuthController from '../controllers/AuthController';

const router = Router();

router.post(
  '/register',
  [
    check('email', "Username can't be empty").notEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('password').isStrongPassword({
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
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refresh);

router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);

export default router;
