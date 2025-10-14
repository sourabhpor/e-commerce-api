import userMiddleware from "./userMiddleware.js";
import validate from "./validateMiddleware.js";
import authMiddleware from "./authMiddleware.js";
import adminMiddleware from "./adminMiddleware.js";

export default { userMiddleware, validate, authMiddleware, adminMiddleware };
