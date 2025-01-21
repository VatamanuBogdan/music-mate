import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useAccount, useAuth } from "./AuthProvider";

export default function AccountAvatar() {
    const auth = useAuth();
    const account = useAccount();

    return (
        <Popover placement="bottom-end">
            <PopoverTrigger className="cursor-pointer">
                <Avatar isBordered name={account.firstName} className="w-10 h-10 m-2 text-xs" />
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