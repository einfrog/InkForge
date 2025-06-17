import { useState } from 'react';

function ImageUpload({ onImageSelect, currentImage, className }) {
    const [preview, setPreview] = useState(currentImage || null);
    const [error, setError] = useState('');

    const handleImageChange = (event) => {
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
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            onImageSelect(file);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={`image-upload ${className || ''}`}>
            <div className="mb-3">
                <label htmlFor="imageUpload" className="form-label">Profile Picture</label>
                <input
                    type="file"
                    className="form-control"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {error && <div className="text-danger mt-2">{error}</div>}
            </div>
            {preview && (
                <div className="mt-2">
                    <img
                        src={preview}
                        alt="Preview"
                        className="img-fluid rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                </div>
            )}
        </div>
    );
}

export default ImageUpload; 