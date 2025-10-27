type SendEmailOTPParams = {
    email: string;
    otp: string
}
type SendSMSOTPParams = {
    phone: string;
    otp: string
}

export const sendEmailOTP = ({ email, otp }: SendEmailOTPParams) => {
    console.log(`otp : ${otp} \nemail : ${email}`)
}
export const sendSMSOTP = ({ phone, otp }: SendSMSOTPParams) => {
    console.log(`otp : ${otp} \nphone : ${phone}`)
}

