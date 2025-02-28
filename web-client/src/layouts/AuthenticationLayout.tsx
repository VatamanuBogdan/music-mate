import { Tab, Tabs } from '@heroui/react';
import logo from 'assets/logo.png';
import { Outlet, useNavigate } from 'react-router';

import MusicMateLogo from '../components/MusicMateLogo';

export default function AuthenticationLayout(): JSX.Element {
    const navigate = useNavigate();

    return (
        <div className="flex flex-nowrap items-strech h-screen bg-zinc-100">
            <div className="basis-3/5 flex items-center justify-center px-10 space-x-10 border-2 rounded-lg border-slate-800 select-none">
                <img src={logo} className="max-w-sm" />

                <div className="relative space-y-2 drop-shadow-md">
                    <MusicMateLogo size="lg" />
                    <h2 className="ml-6 text-2xl font-medium"> Your personal music companion </h2>
                </div>
            </div>

            <div className="basis-2/5 flex items-center justify-center bg-slate-700 border-t-2 border-r-2 border-b-2 rounded-lg border-slate-800">
                <div className="flex flex-col items-center space-y-3">
                    <h1 className="ml-2 text-center text-4xl font-medium text-zinc-100 drop-shadow-xl outline-4 outline-black">
                        Authenticate
                    </h1>

                    <Tabs
                        onSelectionChange={(selection) => {
                            if (selection === 'sign-in') {
                                navigate('/auth/sign-in');
                            } else if (selection === 'sign-up') {
                                navigate('/auth/sign-up');
                            }
                        }}
                    >
                        <Tab key="sign-in" title="Sign In" />
                        <Tab key="sign-up" title="Sign up" />
                    </Tabs>

                    <Outlet />
                </div>
            </div>
        </div>
    );
}
