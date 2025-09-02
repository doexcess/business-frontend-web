import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import toast from 'react-hot-toast';

interface FileUploadProps {
    label: string;
    onUploaded: (result: any) => void;
    accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onUploaded, accept }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            return toast.error('File size should be less than 10MB');
        }

        setUploading(true);

        // Preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(file.name); // Show filename for docs/pdfs
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response: any = await dispatch(
                uploadImage({
                    form_data: formData,
                    onUploadProgress: (event) => {
                        const percent = Math.round((event.loaded * 100) / (event.total || 1));
                        setUploadProgress(percent);
                    },
                })
            );

            if (response.type === 'multimedia-upload/image/rejected') {
                throw new Error(response.payload.message);
            }

            toast.success('File uploaded successfully');
            onUploaded(response.payload);
        } catch (error) {
            toast.error('Failed to upload file');
            setFilePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div
            className="relative flex flex-col items-center justify-center w-full sm:w-72 h-48 rounded-md border border-dashed border-gray-400 p-4 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
        >
            {filePreview ? (
                filePreview.startsWith('data:image') ? (
                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                    <p className="truncate">{filePreview}</p>
                )
            ) : (
                <>
                    <img src="/icons/course/file.svg" alt="upload icon" className="mb-2 w-10 h-10" />
                    <p className="font-medium">Click or drop to upload</p>
                    <p className="text-xs">Supported: JPG, PNG, PDF, DOC. Max 10MB</p>
                </>
            )}

            {uploading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-10 px-4">
                    <p className="font-semibold text-white text-sm mb-3">
                        Uploading... {uploadProgress}%
                    </p>
                    <div className="w-full bg-white/30 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            <input
                type="file"
                accept={accept || 'image/*,.pdf,.doc,.docx'}
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <p className="mt-2 text-sm text-gray-600">{label}</p>
        </div>
    );
};

export default FileUpload;
