import crypto from "crypto";

export const generateReceiptNumber = () => {
    const timestamp = Date.now();
    const randomStr = crypto.randomBytes(3).toString("hex");
    return `receipt#${timestamp}-${randomStr}`;
};
