import { PropsWithChildren, ReactNode, useState } from "react";

type PopoverProps = PropsWithChildren & { 
    content: ReactNode 
};

export default function Popover({ content, children }: PopoverProps) {
    const [isDisplayed, setIsDisplayed] = useState<boolean>(false);

    return (
        <div className="inline-block relative">
            { isDisplayed && (
                <span className="absolute bottom-full"> 
                    {content}
                </span>) 
            }

            <span onClick={() => setIsDisplayed(!isDisplayed)}>
                {children}
            </span>
        </div>
    )
}