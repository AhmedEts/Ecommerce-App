import  systemRoles  from "../../utils/systemRoles.js";

const userEndPoints={
    create:[systemRoles.User],
    update:[systemRoles.User],
    delete:[systemRoles.User],
    get:[systemRoles.Admin,systemRoles.User],
}
export default userEndPoints