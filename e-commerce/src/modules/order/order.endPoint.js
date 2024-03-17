import roles from "../../utils/systemRoles";

const orderEndpoint = {
  createOrder: [roles.User],
  cancelOrder: [roles.User],
  deliveredOrder: [roles.Admin],
}

export default orderEndpoint;