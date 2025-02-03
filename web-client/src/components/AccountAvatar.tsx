import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useAccount, useAuth } from "./AuthProvider";

export default function AccountAvatar() {
    const auth = useAuth();
    const account = useAccount();

    return (
        <Popover showArrow placement="bottom-end">
            <PopoverTrigger className="cursor-pointer">
                <Avatar 
                    isBordered
                    size="lg"
                    color="success"
                    className="m-2 bg-slate-800 bg-opacity-70" />
            </PopoverTrigger>

            <PopoverContent className="px-4 py-2">
                <p className="text-medium font-medium"> {account.username} </p>
                <Button fullWidth onPress={() => auth.signOut()}>
                    Sign out 
                </Button>
            </PopoverContent>
        </Popover>
    )
}