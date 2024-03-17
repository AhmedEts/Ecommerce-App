import { Router } from "express";
import * as userController from './controller/user.controller.js'
import  auth  from '../../middleware/auth.js'
import { asyncHandler } from "../../utils/asyncHandler.js";
import userEndPoints from './user.endPoint.js';


const router = Router()

router.patch('/updateUser',auth(userEndPoints.update),asyncHandler(userController.updateUser));
router.patch('/updatePassword',auth(userEndPoints.update),asyncHandler(userController.updatePassword))
router.delete('/delete', auth(userEndPoints.deleteUser),asyncHandler(userController.deleteUser))
router.put('/softDelete',auth(userEndPoints.softDelete),asyncHandler(userController.softDelete))
router.post('/logout',auth(userEndPoints.logout),asyncHandler(userController.logout))
router.get('/confirmEmail/:token', auth(userEndPoints.confirmEmail),asyncHandler(userController.confirmEmail))
router.post('/Forget',auth(userEndPoints.forget),asyncHandler(userController.forget))




export default router