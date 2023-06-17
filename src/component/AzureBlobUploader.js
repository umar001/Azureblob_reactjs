import React, { useState } from 'react';
import uploadFileToBlob, { isStorageConfigured, getBlobsInContainer } from '../lib/azure-storage-blob';


const AzureBlobUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [tags, setTags] = useState('');
    const [tagInputs, setTagInputs] = useState([{ name: '', value: '' }]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleTagChange = (index, event) => {
        const updatedTagInputs = [...tagInputs];
        updatedTagInputs[index][event.target.name] = event.target.value;
        setTagInputs(updatedTagInputs);
    };

    const handleAddTag = () => {
        setTagInputs([...tagInputs, { name: '', value: '' }]);
    };

    const handleRemoveTag = (index) => {
        const updatedTagInputs = [...tagInputs];
        updatedTagInputs.splice(index, 1);
        setTagInputs(updatedTagInputs);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file.');
            return;
        }

        const tagHeaders = tagInputs.reduce((headers, tag, index) => {
            if (tag.name && tag.value) {
                headers[`${tag.name}`] = tag.value;
            }
            return headers;
        }, {});

        try {
            // console.log(tagHeaders)
            await uploadFileToBlob(selectedFile, tagHeaders)
            // const response = await fetch(url, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': selectedFile.type,
            //         ...tagHeaders,
            //     },
            //     body: selectedFile,
            // });

            // if (response.ok) {
            //     console.log('File uploaded successfully with tags!');
            // } else {
            //     console.log('File upload failed.');
            // }
        } catch (error) {
            console.log('Error occurred during file upload:', error);
        }
    };

    return (
        <div>
            <h1>Azure Blob Uploader</h1>
            <div>
                <label htmlFor="fileInput">Select File: </label>
                <input id="fileInput" type="file" onChange={handleFileChange} />
            </div>
            <div>
                <h2>Tags</h2>
                {tagInputs.map((tag, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            placeholder="Tag Name"
                            name="name"
                            value={tag.name}
                            onChange={(e) => handleTagChange(index, e)}
                        />
                        <input
                            type="text"
                            placeholder="Tag Value"
                            name="value"
                            value={tag.value}
                            onChange={(e) => handleTagChange(index, e)}
                        />
                        <button onClick={() => handleRemoveTag(index)}>Remove</button>
                    </div>
                ))}
                <button onClick={handleAddTag}>Add Tag</button>
            </div>
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default AzureBlobUploader;
