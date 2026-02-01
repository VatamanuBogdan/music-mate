import { Avatar, Button, Divider, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useAccount, useAuth } from 'providers/AuthProvider';
import { FaSpotify } from 'react-icons/fa';

interface SpotifyAuthButtonProps {
    isAuthorizes: boolean;
    onAuthorization?(): () => void;
}

function SpotifyAuthButton({ isAuthorizes, onAuthorization }: SpotifyAuthButtonProps) {
    return (
        <Button
            fullWidth
            radius="none"
            isDisabled={isAuthorizes}
            className="h-12 text-lg text-slate-100 font-medium bg-transparent"
            onPress={onAuthorization}
        >
            <FaSpotify /> {isAuthorizes ? 'Spotify Authorized' : 'Authorize Spotify'}
        </Button>
    );
}

export default function AccountAvatar(): JSX.Element {
    const auth = useAuth();
    const account = useAccount();

    return (
        <Popover
            placement="top"
            classNames={{
                content: 'bg-slate-800 bg-opacity-20 backdrop-blur-sm',
            }}
        >
            <PopoverTrigger className="cursor-pointer">
                <Avatar
                    size="lg"
                    color="success"
                    classNames={{
                        base: 'bg-slate-700 bg-opacity-80 backdrop-blur-sm',
                        icon: 'text-slate-200',
                    }}
                />
            </PopoverTrigger>

            <PopoverContent>
                <p className="text-xl text-slate-200 px-4 w-30 font-medium mb-2">
                    {account.username}
                </p>
                <Divider className="bg-slate-200" />

                <SpotifyAuthButton isAuthorizes={true} />

                <Button fullWidth onPress={() => auth.signOut()}>
                    Sign out
                </Button>
            </PopoverContent>
        </Popover>
    );
}
