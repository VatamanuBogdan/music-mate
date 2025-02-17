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
import useAddPlaylist from 'hooks/useAddPlaylist';
import { useRef, useState } from 'react';

interface AddPlaylistModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose?: () => void;
}

export default function AddPlaylistModal({
    isOpen,
    onOpenChange,
}: AddPlaylistModalProps): JSX.Element {
    const [playlistTitle, setPlaylistTitle] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const addPlaylist = useAddPlaylist();

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    function onPlaylistImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const thumbnailFile = event.target.files?.[0];
        if (!thumbnailFile) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setThumbnailPreview(fileReader.result as string);
        };
        fileReader.readAsDataURL(thumbnailFile);
    }

    function onClose() {
        setPlaylistTitle('');
        setPlaylistDescription('');
        setThumbnailPreview(null);
    }

    function onPlaylistCreate(close: () => void) {
        try {
            addPlaylist({ name: playlistTitle, description: playlistDescription });
            close();
        } catch (error) {
            console.log(`Failed to add playlist ${error}`);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            size="xl"
            backdrop="blur"
            hideCloseButton
            isDismissable={false}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <h1 className="text-3xl font-bold">Add New Playlist</h1>
                        </ModalHeader>

                        <ModalBody>
                            <div className="flex flex-row justify-center items-center space-x-4">
                                <div className="flex-grow space-y-2">
                                    <Input
                                        label="Title"
                                        type="text"
                                        size="lg"
                                        labelPlacement="inside"
                                        maxLength={32}
                                        value={playlistTitle}
                                        onValueChange={setPlaylistTitle}
                                    />

                                    <Textarea
                                        label="Description"
                                        type="text"
                                        size="lg"
                                        maxRows={2}
                                        maxLength={64}
                                        labelPlacement="inside"
                                        value={playlistDescription}
                                        onValueChange={setPlaylistDescription}
                                    />
                                </div>

                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={onPlaylistImageUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        isIconOnly
                                        onPress={() => fileInputRef.current?.click()}
                                        className="w-40 h-40 bg-transparent"
                                    >
                                        <Image
                                            isZoomed={thumbnailPreview !== null}
                                            src={thumbnailPreview ?? playlistAddImage}
                                            className="w-40 h-40 object-fill"
                                        />
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="danger"
                                radius="sm"
                                className="text-xl font-medium w-18 h-12"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                radius="sm"
                                className="text-xl font-medium w-18 h-12"
                                onPress={() => onPlaylistCreate(onClose)}
                            >
                                Create
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
