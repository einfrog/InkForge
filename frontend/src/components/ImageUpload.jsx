import { useState } from 'react';
import * as apiService from '../services/apiService';

function ImageUpload({ 
    type, // 'profile', 'project', or 'character'
    id, // user_id, project_id, or character_id
    currentImage,
    onImageUploaded,
    className,
    shape = 'circle', // 'circle' or 'square'
    size = 'medium', // 'small', 'medium', or 'large'
    disabled
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const getImageUrl = (path) => {
        if (!path) {
            switch (type) {
                case 'profile':
                    return '/default-profile.png';
                case 'project':
                    return '/default-project.png';
                case 'character':
                    return '/default-character.png';
                default:
                    return '/default-profile.png';
            }
        }
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { width: '60px', height: '60px' };
            case 'large':
                return { width: '300px', height: '300px' };
            default: // medium
                return { width: '150px', height: '150px' };
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setError('');
        setIsUploading(true);

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        try {
            const token = localStorage.getItem('token');
            let result;

            if (type === 'profile') {
                result = await apiService.uploadUserImage(id, file, token);
            } else if (type === 'project') {
                result = await apiService.uploadProjectImage(id, file, token);
            } else if (type === 'character') {
                result = await apiService.uploadCharacterImage(id, file, token);
            }

            if (result && result.path) {
                console.log('Upload successful, path:', result.path);
                onImageUploaded(result.path, file);
                setUploadedImage(result);
                setPreview(null); // Clear preview after successful upload
            } else {
                console.error('Upload response missing path:', result);
                setError('Upload failed: Invalid response from server');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setError('Failed to upload image. Please try again.');
            setPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const getLabel = () => {
        switch (type) {
            case 'profile':
                return 'Profile Picture';
            case 'project':
                return 'Project Cover';
            case 'character':
                return 'Character Image';
            default:
                return 'Image';
        }
    };

    return (
        <div className={`image-upload ${className || ''}`}>
            <div className="mb-3">
                <label htmlFor="imageUpload" className="form-label">{getLabel()}</label>
                <input
                    type="file"
                    className="form-control"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading || disabled}
                />
                {error && <div className="text-danger mt-2">{error}</div>}
                {isUploading && <div className="text-muted mt-2">Uploading...</div>}
            </div>
            <div className="mt-2">
                <img
                    src={preview || getImageUrl(currentImage)}
                    alt={getLabel()}
                    className={`img-fluid ${shape === 'circle' ? 'rounded-circle' : 'rounded'}`}
                    style={{
                        ...getSizeStyles(),
                        objectFit: 'cover'
                    }}
                />
            </div>
        </div>
    );
}

export default ImageUpload; 