import systemRoles from "../../utils/systemRoles.js";

const authEndpoint = {
  updatePassword: [systemRoles.Admin, systemRoles.User],
  updateAccount: [systemRoles.Admin, systemRoles.User],
  deleteAccount: [systemRoles.Admin, systemRoles.User]
};
export default authEndpoint;