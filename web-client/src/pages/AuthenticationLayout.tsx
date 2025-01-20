import { useState } from "react"
import { Outlet, useNavigate } from "react-router";

import ToggleGroup from '../components/ToggleGroup';
import { IdentifiableValue } from "../utils/helpers";

import logo from '../assets/logo.png'

enum AuthenticationType {
    SIGN_IN,
    SIGN_UP
}

const authTypeItems: IdentifiableValue<AuthenticationType, string>[] = [
    { id: AuthenticationType.SIGN_IN, value: 'Sign In' },
    { id: AuthenticationType.SIGN_UP, value: 'Sign Up' }
]

const authTypePaths: Record<AuthenticationType, string> = {
    [AuthenticationType.SIGN_IN]: '/login',
    [AuthenticationType.SIGN_UP]: '/register'
};

export default function AuthenticationLayout() {

    const [selectedAuthType, setAuthenticationType] = useState<number>(0);
    const navigate = useNavigate();

    function changeAuthType(type: AuthenticationType) {
        setAuthenticationType(type);
        navigate(authTypePaths[type])
    }

    return (
       <div className='flex flex-nowrap items-strech h-screen bg-zinc-100'>
            <div className='basis-3/5 flex items-center justify-center px-10 space-x-10 border-2 rounded-lg border-slate-800 select-none'> 
                <img src={logo} className='max-w-sm' />
                
                <div className='relative space-y-2 drop-shadow-md'>
                    <h1 className='px-4 py-2 text-8xl font-bold border-2 border-slate-800 rounded-md'> Music Mate </h1> 
                    <h2 className='ml-6 text-2xl font-medium'> Your personal music companion </h2>
                </div>
            </div>

            <div className='basis-2/5 flex items-center justify-center bg-slate-700 border-t-2 border-r-2 border-b-2 rounded-lg border-slate-800'> 
                <div className='flex flex-col items-center space-y-3'>
                    <h1 className='ml-2 text-center text-4xl font-medium text-zinc-100 drop-shadow-xl outline-4 outline-black'>
                         Authenticate 
                    </h1>

                    <ToggleGroup
                        items={authTypeItems}
                        selectedItemId={selectedAuthType}
                        onChange={changeAuthType} />

                    <Outlet/>
                </div>
            </div>
       </div>
    )
}