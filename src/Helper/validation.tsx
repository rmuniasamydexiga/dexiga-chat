import * as yup from 'yup'
export const signUpValidationSchema = yup.object().shape({
      name: yup.string().trim().matches(/^[A-Za-z]+$/, 'Name must contain only alphabetic characters').required('Name is required'),
      userName:yup.string().required('userName Address is Required'),
      email: yup.string().email('Invalid email format').required('email  is Required'),
      password: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).*$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Password is required'),
      mobile: yup.string().matches(
        /^[0-9]{8,12}$/, // Modify this regular expression based on the format you want to validate
        'Invalid mobile number format'
      ).required('Mobile number is required'),
      confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),      
      userId: yup.string().required('UserId is Required'),
      userType:yup.string().required('userType is Required')
   })

   export const signInValidationSchema = yup.object().shape({
    email: yup.string().required('User name is Required'),
    password: yup.string().required('Password is Required'),
    userType:yup.string().required('userType is Required')

    
   })






   export const validation=async (schema: { validate: (arg0: any, arg1: { abortEarly: boolean; }) => any; },req: any)=>{
    try {
         await schema.validate(req,{ abortEarly: false });
         return {status:true,error:null}
        } catch (error:any) {
          const validationErrors :any= {};
          error.inner.forEach((err: { path: string | number; message: any; }) => {
            validationErrors[err?.path] = err.message;
          });
          return {status:false,error:validationErrors}

    
        }
   }
   