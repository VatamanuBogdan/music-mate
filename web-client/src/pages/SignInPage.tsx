import { Button, Input } from '@heroui/react';
import { useAuth } from 'providers/AuthProvider';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function SignInPage(): JSX.Element {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSignIn() {
        if (await signIn(email, password)) {
            navigate('/home');
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-80 space-y-2">
            <Input label="Email" size="sm" type="email" value={email} onValueChange={setEmail} />
            <Input
                label="Password"
                size="sm"
                type="password"
                value={password}
                onValueChange={setPassword}
            />

            <Button size="lg" onPress={handleSignIn}>
                Sign In
            </Button>
        </div>
    );
}
