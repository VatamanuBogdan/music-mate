import { Button, DatePicker, DateValue, Input } from '@heroui/react';
import { useAuth } from 'providers/AuthProvider';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function SignUpPage(): JSX.Element {
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState<DateValue | null>(null);

    async function handleSignUp() {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedBirthDate = birthDate?.toDate(timeZone).toISOString().split('T')[0];

        if (
            firstName === '' ||
            lastName === '' ||
            email === '' ||
            password === '' ||
            !formattedBirthDate
        ) {
            console.error('Form is not filled out');
            return;
        }

        const signUpData = {
            firstName,
            secondName: lastName,
            email,
            password,
            birthDate: formattedBirthDate,
        };

        if (await signUp(signUpData)) {
            navigate('/home');
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-80 space-y-2">
            <Input
                label="First Name"
                size="sm"
                type="text"
                value={firstName}
                onValueChange={setFirstName}
            />
            <Input
                label="Last Name"
                size="sm"
                type="text"
                value={lastName}
                onValueChange={setLastName}
            />
            <Input label="Email" size="sm" type="email" value={email} onValueChange={setEmail} />
            <Input
                label="Password"
                size="sm"
                type="password"
                value={password}
                onValueChange={setPassword}
            />
            <DatePicker label="Birth Date" value={birthDate} onChange={setBirthDate} />;
            <Button onPress={handleSignUp}>Sign Up</Button>
        </div>
    );
}
