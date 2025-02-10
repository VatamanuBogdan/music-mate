import {
    Button,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from '@heroui/react';
import playlistAddImage from 'assets/playlist-add-image.svg';
import { useRef, useState } from 'react';


interface AddPlaylistModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
}

export default function AddPlaylistModal({
    isOpen,
    onOpenChange,
}: AddPlaylistModalProps): JSX.Element {
    const [playlistTitle, setPlaylistTitle] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    function onPlaylistImageUpload() {
        fileInputRef.current?.click();
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xl"
            backdrop="blur"
            hideCloseButton
            isDismissable={false}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-end px-12">
                            <h1 className="text-3xl font-bold">Add New Playlist</h1>
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <Button
                                    isIconOnly
                                    onPress={onPlaylistImageUpload}
                                    className="w-36 h-36 bg-transparent"
                                >
                                    <Image src={playlistAddImage} />
                                </Button>
                            </>
                        </ModalHeader>

                        <ModalBody>
                            <Input
                                label="Title"
                                type="text"
                                size="lg"
                                labelPlacement="inside"
                                value={playlistTitle}
                                onValueChange={setPlaylistTitle}
                            />

                            <Textarea
                                label="Description"
                                type="text"
                                size="lg"
                                maxRows={3}
                                labelPlacement="inside"
                                value={playlistDescription}
                                onValueChange={setPlaylistDescription}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="primary"
                                radius="sm"
                                className="text-xl font-medium w-18 h-12"
                            >
                                Submit
                            </Button>
                            <Button
                                color="danger"
                                radius="sm"
                                className="text-xl font-medium w-18 h-12"
                                onPress={onOpenChange}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
