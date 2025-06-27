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
                         disabled,
                         variant = 'default' // 'default', 'overlay', 'minimal'
                     }) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null); // Stores base64 preview of selected file
    const [uploadedImage, setUploadedImage] = useState(null);

    // Helper function to construct proper image URLs based on image path
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
        // If already a full URL (starts with http), return as-is
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
                return { width: '120px', height: '120px' };
        }
    };

    // Main function to handle file selection and upload process
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

            // Call different API endpoints based on upload type
            if (type === 'profile') {
                result = await apiService.uploadUserImage(id, file, token);
            } else if (type === 'project') {
                result = await apiService.uploadProjectImage(id, file, token);
            } else if (type === 'character') {
                result = await apiService.uploadCharacterImage(id, file, token);
            }

            // Handle successful upload response
            if (result && result.path) {
                console.log('Upload successful, path:', result.path);
                onImageUploaded(result.path, file); // notify parent component
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

    // Helper function to get appropriate label text based on upload type
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

    // Overlay variant for profile pages
    if (variant === 'overlay') {
        return (
            <div className={`image-upload-overlay ${className || ''}`}>
                <div className="image-upload-overlay-wrapper">
                    <img
                        src={preview || getImageUrl(currentImage)}
                        alt={getLabel()}
                        className={`image-upload-overlay-img ${shape === 'circle' ? 'rounded-circle' : 'rounded'}`}
                        style={{
                            ...getSizeStyles(),
                            objectFit: 'cover'
                        }}
                    />
                    <div className="image-upload-overlay-hover">
                        <input
                            type="file"
                            className="image-upload-overlay-input"
                            id={`imageUpload-${id}`}
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isUploading || disabled}
                        />
                        <label
                            htmlFor={`imageUpload-${id}`}
                            className="image-upload-overlay-label"
                        >
                            {isUploading ? 'Uploading...' : 'Change Photo'}
                        </label>
                    </div>
                </div>
                {error && <div className="image-upload-error">{error}</div>}
            </div>
        );
    }

    // Minimal variant - just image with hidden file input
    if (variant === 'minimal') {
        return (
            <div className={`image-upload-minimal ${className || ''}`}>
                <input
                    type="file"
                    className="image-upload-minimal-input"
                    id={`imageUpload-${id}`}
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading || disabled}
                />
                <label htmlFor={`imageUpload-${id}`} className="image-upload-minimal-label">
                    <img
                        src={preview || getImageUrl(currentImage)}
                        alt={getLabel()}
                        className={`image-upload-minimal-img ${shape === 'circle' ? 'rounded-circle' : 'rounded'}`}
                        style={{
                            ...getSizeStyles(),
                            objectFit: 'cover'
                        }}
                    />
                    <div className="image-upload-minimal-overlay">
                        {isUploading ? 'Uploading...' : 'Click to change'}
                    </div>
                </label>
                {error && <div className="image-upload-error">{error}</div>}
            </div>
        );
    }

    // Default variant - original form layout
    return (
        <div className={`image-upload ${className || ''}`}>
            <div className="mb-3">
                <label htmlFor={`imageUpload-${id}`} className="form-label">{getLabel()}</label>
                <input
                    type="file"
                    className="form-control"
                    id={`imageUpload-${id}`}
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