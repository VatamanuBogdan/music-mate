import axios from 'axios';

import { useState } from "react"

type Credentials = {
    email: string,
    password: string
};

export default function LoginPage() {
    const [credentials, setCredentials] = useState<Credentials>(
        {
            email: "", 
            password: ""
        }
    );
    
    function handleEmailChange(email: string) {
        setCredentials({ ...credentials, email });
    }

    function handlePasswordChnage(password: string) {
        setCredentials({ ...credentials, password });
    }

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log(`Credentials ${credentials.email} ${credentials.password}`);
        
        try {
            const response = await axios.post("http://127.0.0.1:8080/api/auth/login", credentials);
            console.log(response.data.authToken.value);
        } catch (error) {
            console.log(error);
        }
    }

    return (
       <div className='flex items-center justify-center h-screen'>

            <form className='space-y-4 bg-blue-500 px-16 py-10 rounded-xl shadow' onSubmit={handleLogin}>
                <p className='text-2xl text-center text-white font-bold'> Musimate </p>
                
                <div>
                    <input type="text"
                        className='text-sm p-2.5 rounded-lg'
                        value={credentials.email} 
                        placeholder="Email"
                        onChange={e => handleEmailChange(e.target.value)} />
                </div>

                <div>
                    <input type="password"
                        className='text-sm p-2.5 rounded-lg'
                        value={credentials.password}
                        placeholder='Password' 
                        onChange={e => handlePasswordChnage(e.target.value)} />
                </div>

               <div className='text-center' >               
                    <button className='text-white font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700' type="submit"> 
                        Login 
                    </button>
                </div>
            </form>
       </div>
    )
}