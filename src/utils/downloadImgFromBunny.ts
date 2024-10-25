import bunnyConfig from './bunnyConfig';

export const downloadImageFromBunny = (
    {
        avatar
    }: any
) => {
    const bunnyBaseUrl = bunnyConfig.storage.baseUrl;
    try {
        return `${bunnyBaseUrl}/${avatar?.dir}/${avatar?.name}`
    } catch (err) {
        console.log(err, '!!');
    }
};