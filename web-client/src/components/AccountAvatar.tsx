import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useAccount, useAuth } from 'providers/AuthProvider';

export default function AccountAvatar(): JSX.Element {
    const auth = useAuth();
    const account = useAccount();

    return (
        <Popover
            placement="bottom-end"
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

            <PopoverContent className="px-4 py-2">
                <p className="text-xl text-slate-200 h-20 w-30 font-medium">{account.username}</p>
                <Button fullWidth onPress={() => auth.signOut()}>
                    Sign out
                </Button>
            </PopoverContent>
        </Popover>
    );
}
