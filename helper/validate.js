/* validate.js 條件 */
export const constraints = {
    "name": {
        presence: {
            message: "必填!",
        }
    },
    "tel": {
        presence: {
            message: "必填!"
        },
    },
    "email": {
        presence: {
            message: "必填!"
        },
        email: true
    },
    "address": {
        presence: {
            message: "必填!"
        },
    },
}
