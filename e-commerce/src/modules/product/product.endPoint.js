import  systemRoles  from "../../utils/systemRoles.js";

const productEndPoints={
    create:[systemRoles.Admin],
    update:[systemRoles.Admin],
}
export default productEndPoints