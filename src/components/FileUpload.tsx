import { useState, useCallback } from 'react';
import { useUploadFile } from '../hooks/files.hooks';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';

interface FileUploadProps {
    onUploadSuccess: (fileUrl: string) => void;
    accept?: string;
    maxSize?: number; // in MB
    label?: string;
    currentFile?: string;
}

export default function FileUpload({
    onUploadSuccess,
    accept = '*',
    maxSize = 5,
    label = 'Upload File',
    currentFile
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string>(currentFile || '');
    const uploadFile = useUploadFile();

    const validateFile = (file: File): string | null => {
        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
            return `File quá lớn. Kích thước tối đa: ${maxSize}MB`;
        }

        // Check file type if accept is specified
        if (accept !== '*') {
            const acceptedTypes = accept.split(',').map(t => t.trim());
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            const mimeType = file.type;

            const isValid = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return fileExtension === type.toLowerCase();
                }
                return mimeType.match(new RegExp(type.replace('*', '.*')));
            });

            if (!isValid) {
                return `Định dạng file không hợp lệ. Chỉ chấp nhận: ${accept}`;
            }
        }

        return null;
    };

    const handleFileSelect = useCallback(async (file: File) => {
        const error = validateFile(file);
        if (error) {
            alert(error);
            return;
        }

        setSelectedFile(file);

        try {
            const response = await uploadFile.mutateAsync(file);
            const fileUrl = response.path || response.filename;
            setUploadedUrl(fileUrl);
            onUploadSuccess(fileUrl);
        } catch (error: any) {
            alert(error?.response?.data?.message || 'Upload thất bại!');
            setSelectedFile(null);
        }
    }, [uploadFile, onUploadSuccess]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setUploadedUrl('');
        onUploadSuccess('');
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-stone-700 mb-2">
                {label}
            </label>

            {/* Upload Area */}
            {!uploadedUrl && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                        ${isDragging
                            ? 'border-red-500 bg-red-50'
                            : 'border-stone-300 hover:border-stone-400 bg-stone-50'
                        }
                        ${uploadFile.isPending ? 'opacity-50 pointer-events-none' : ''}
                    `}
                >
                    <input
                        type="file"
                        onChange={handleFileInputChange}
                        accept={accept}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadFile.isPending}
                    />

                    <div className="flex flex-col items-center gap-3">
                        {uploadFile.isPending ? (
                            <>
                                <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                                <p className="text-sm text-stone-600">Đang upload...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-stone-400" />
                                <div>
                                    <p className="text-sm font-medium text-stone-700">
                                        Kéo thả file vào đây hoặc click để chọn
                                    </p>
                                    <p className="text-xs text-stone-500 mt-1">
                                        {accept !== '*' && `Định dạng: ${accept} • `}
                                        Tối đa {maxSize}MB
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Uploaded File Preview */}
            {uploadedUrl && (
                <div className="border border-stone-300 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-stone-900">
                                    {selectedFile?.name || 'File đã upload'}
                                </p>
                                <p className="text-xs text-stone-500">
                                    {uploadedUrl}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-stone-600" />
                        </button>
                    </div>
                </div>
            )}

            {/* Error State */}
            {uploadFile.isError && (
                <p className="text-sm text-red-600 mt-2">
                    Upload thất bại. Vui lòng thử lại.
                </p>
            )}
        </div>
    );
}
