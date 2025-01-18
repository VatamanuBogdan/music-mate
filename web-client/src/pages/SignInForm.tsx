import InputField from "../components/InputField";
import useFormInput from "../hooks/useFormInput";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router";

export default function SignInForm() {
    
    const [email, onEmailChange] = useFormInput('');
    const [password, onPasswordChange] = useFormInput('');
    const navigate = useNavigate();

    const { signIn } = useAuth();

    async function performLogin() {
        await signIn(email, password);
        navigate('/home');
    }

    return (         
        <>
            <InputField placeholder='Email' onChange={onEmailChange}/>
            
            <InputField placeholder='Password' hidden={true} onChange={onPasswordChange}/>
        
            <button className='self-start -mt-8 px-1 text-sm text-teal-500'> 
                Did you forget your password? 
            </button>

            <button className='w-28 h-14 rounded-lg border-2 border-teal-500 text-zinc-100 font-medium hover:bg-teal-500 text-lg bg-transparent'
                    onClick={performLogin}> 
                Sign In 
            </button>
        </>
    );
} 