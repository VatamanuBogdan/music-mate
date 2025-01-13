import InputField from "../components/InputField";

export default function LoginForm() {
    return (         
        <>
            <InputField placeholder='Email'/>
            <InputField placeholder='Password' hidden={true}/>
        
            <button className='self-start -mt-8 px-1 text-sm text-teal-500'> Did you forget your password? </button>
            <button className='w-28 h-14 rounded-lg border-2 border-teal-500 text-zinc-100 font-medium hover:bg-teal-500 text-lg bg-transparent'> Login </button>
        </>
    );
} 