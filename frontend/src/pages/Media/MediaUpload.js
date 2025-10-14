// components/Media/MediaUpload.js
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const MediaUpload = () => {
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState({});

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => setFiles(acceptedFiles)
  });

  const handleUpload = async () => {
    // Implementation for file upload with metadata
  };

return (
    <div>
        <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: 20, marginBottom: 20 }}>
            <input {...getInputProps()} />
            <p>Drag & drop files here, or click to select files</p>
        </div>

        {files.length > 0 && (
            <div>
                <h4>Selected Files:</h4>
                <ul>
                    {files.map((file) => (
                        <li key={file.path || file.name}>
                            {file.name} - {(file.size / 1024).toFixed(2)} KB
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Metadata inputs (title, description, tags) */}
        <div style={{ marginTop: 20 }}>
            <input
                type="text"
                placeholder="Title"
                value={metadata.title || ''}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                style={{ display: 'block', marginBottom: 10 }}
            />
            <textarea
                placeholder="Description"
                value={metadata.description || ''}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                style={{ display: 'block', marginBottom: 10 }}
            />
            <input
                type="text"
                placeholder="Tags (comma separated)"
                value={metadata.tags || ''}
                onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
                style={{ display: 'block', marginBottom: 10 }}
            />
        </div>

        {/* Upload button */}
        <button onClick={handleUpload} disabled={files.length === 0}>
            Upload
        </button>
    </div>
);
};