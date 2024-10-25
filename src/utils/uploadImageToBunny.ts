import moment from 'moment';
import bunnyConfig from './bunnyConfig';

export type ImageDirectoryType = 'profile' | 'feed' | 'files'

type Props = {
  files: any[]
  dir?: ImageDirectoryType
};
const uploadImageToBunny = async ({ files, dir }: Props) => {
  try {

    const zoneName = bunnyConfig.storage.storageZoneName;
    const uploadBaseUrl = bunnyConfig.storage.uploadBaseUrl;    
    const promises = files?.map(async (file: any) => { 
      
      
      const fileName = `${moment()}_${file.name}`;
      const uploadUrl = `${uploadBaseUrl}/${zoneName}/${dir}/${fileName}`;

      const blob =  new Blob([file],{type:file.type});
      
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          accept: 'application/octet-stream',
          AccessKey: '78632185-4c08-4ce9-bbfb77e64bbc-69be-4c34',
          'Content-Type': 'application/json',
        },
        body: blob,
      });

      const fileFormat = fileName?.split('.');

      if (response.ok) {
        return {
          name: fileName,
          dir,
          type: localStorage.getItem("fileType"),
          format: fileFormat.length > 1 ? fileFormat.pop() : ''
        };
      } else {
        console.error(`Failed to upload ${fileName}`, response.statusText);
      }
    })
    const res = await Promise.all(promises)
    console.log(res, "hhhhhhhhhhhh")
    return res
  } catch (e) {
    console.log(e, 'errror');
  }
};

export default uploadImageToBunny;