// ./src/azure-storage-blob.ts

// <snippet_package>
// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
import { BlobServiceClient } from "@azure/storage-blob";

const containerName = `testcontaier`;
const sasToken = "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-06-18T03:38:19Z&st=2023-06-17T19:38:19Z&spr=https&sig=A%2Bqu2dQc26vAapdRgoZ6zBHf70mqVHI6LwOsuZuLn%2Fw%3D";
const storageAccountName = "storageforreactjsapp";
// </snippet_package>

// <snippet_get_client>
const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`;
console.log(uploadUrl);

// get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
const blobService = new BlobServiceClient(uploadUrl);

// get Container - full public read access
const containerClient =
    blobService.getContainerClient(containerName);
// </snippet_get_client>

// <snippet_isStorageConfigured>
// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => {
    return !storageAccountName || !sasToken ? false : true;
};
// </snippet_isStorageConfigured>

// <snippet_getBlobsInContainer>
// return list of blobs in container to display
export const getBlobsInContainer = async () => {
    const returnedBlobUrls = [];

    // get list of blobs in container
    // eslint-disable-next-line
    for await (const blob of containerClient.listBlobsFlat()) {
        console.log(`${blob.name}`);

        const blobItem = {
            url: `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}?${sasToken}`,
            name: blob.name
        }

        // if image is public, just construct URL
        returnedBlobUrls.push(blobItem);
    }

    return returnedBlobUrls;
};
// </snippet_getBlobsInContainer>

// <snippet_createBlobInContainer>
const createBlobInContainer = async (file, tags) => {
    // create blobClient for container
    // const blobClient = containerClient.getBlockBlobClient(file.name);
    const blobName = `file_${new Date().getTime()}_${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(file.name);
    // set mimetype as determined from browser with file upload control
    console.log(tags)
    const options = {
        blobHTTPHeaders: { blobContentType: file.type }, metadata: tags
    };
    console.log(options)
    // upload file
    // await blockBlobClient.setTags(tags);
    await blockBlobClient.uploadData(file, options);
};

// </snippet_createBlobInContainer>

// <snippet_uploadFileToBlob>
const uploadFileToBlob = async (file, tags) => {
    if (!file) return;

    // upload file
    await createBlobInContainer(file, tags);
};
// </snippet_uploadFileToBlob>

export default uploadFileToBlob;