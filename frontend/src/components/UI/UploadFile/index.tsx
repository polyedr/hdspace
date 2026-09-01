import React, { memo, useCallback } from 'react';
import Icon from '../Icon';

import styles from './styles.scss';

interface IUploadFile {
  file: any;
  imgPreviewUrl?: string | ArrayBuffer;
}

interface IUploadImagesProps {
  active?: boolean;
  title?: string;
  format?: string[];
  uploadFile: (file: IUploadFile) => void;
}

const UploadFile: React.FunctionComponent<IUploadImagesProps> = ({
  active = true,
  title = 'upload my file',
  format = [],
  uploadFile,
}) => {
  const handleChangeFile = useCallback(
    (e) => {
      e.preventDefault();

      const reader = new FileReader();
      const file = e.target.files[0];
      // show loader

      // reader.onloadend = () => {
      //   if (file.size > 150000) {
      //     // console.error(`'${file.name}' is too large, please pick a smaller file`);
      //     // return;
      //   }

      //   if (!format.length && !file.type.match('image.*')) {
      //     // console.error(`'${file.type}' is not a supported format`);
      //     // return;
      //   }

      //   uploadFile({ file, imgPreviewUrl: reader.result });
      // };
      uploadFile({ file, imgPreviewUrl: reader.result || undefined });
      // reader.readAsDataURL(file);
    },
    [format, uploadFile],
  );

  return active ? (
    <div className={styles.modalUploadFieldContainer}>
      <label htmlFor="upload" className={styles.uploadFieldTitle}>
        {title}
        <div className={styles.uploadFieldBlock}>
          <Icon icon="cloud-upload" size={32} />
          <input
            className={styles.uploadField}
            type="file"
            name="upload"
            id="upload"
            onChange={handleChangeFile}
          />
        </div>
      </label>
    </div>
  ) : null;
};

export default memo(UploadFile);
