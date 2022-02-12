import React from "react";
import { Model } from "@react3l/react3l/core/model";
import { AppUser } from "models/AppUser";
import doc from "../../../assets/images/filetype/doc-file.svg";
import jpg from "../../../assets/images/filetype/jpg-file.svg";
import mp3 from "../../../assets/images/filetype/mp3-file.svg";
import pdf from "../../../assets/images/filetype/pdf-file.svg";
import png from "../../../assets/images/filetype/png-file.svg";
import ppt from "../../../assets/images/filetype/ppt-file.svg";
import txt from "../../../assets/images/filetype/txt-file.svg";
import xls from "../../../assets/images/filetype/xls-file.svg";
import zip from "../../../assets/images/filetype/zip-file.svg";
import blank from "../../../assets/images/filetype/blank-file.svg";
import './FileType.scss';


export class FileModel extends Model
{
    public id?: number;

    public name?: string;

    public url?: string;

    public appUserId?: number;

    public extension?: string;

    public size?: number;

    public rowId?: string;

    public appUser?: AppUser;
}


export interface FilteTypeProps {
  file?: FileModel;
  index?: number;
  isShowClear?: boolean;
  handleDeleteFile?: (index: number) => (event: any) => void;
}

export function FileType(props: FilteTypeProps) {
  const { 
    file, 
    index,
    isShowClear, 
    handleDeleteFile 
  } = props;

  const formatBytes = React.useCallback((bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }, []);


  const fileSize = React.useMemo(() => {
    let sizeNumber = '0';
    if (file) {
      sizeNumber = formatBytes(file.size);
    }
    return `${sizeNumber}`;
  }, [file, formatBytes]);

  const imgSrc = React.useMemo(() => {
    if (file) {
      switch (file.extension) {
        case ".doc":
          return doc;
        case '.docx':
          return doc;
        case ".jpg":
          return jpg;
        case ".mp3":
          return mp3;
        case ".pdf":
          return pdf;
        case ".png":
          return png;
        case ".ppt":
          return ppt;
        case '.pptx':
          return ppt;
        case ".txt":
          return txt;
        case ".xls":
          return xls;
        case ".xlsx":
          return xls;
        case ".zip":
          return zip;
        case ".rar":
          return zip;
        case ".jar":
          return zip;
        default:
          return blank;
      }
    }
    return "";
  }, [file]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            

  return (
    <>
      <div className="file-type__container">
        <div className="file-type__left-side">
          <img src={imgSrc} alt="IMG"></img>
        </div>
        <div className="file-type__right-side">
          <div className="right-side__container">
            <div className="side__first-row">
              <a href={file?.url} download={file.name}>{file?.name}</a>
            </div>
            <div className="side__second-row">{fileSize}</div>
          </div>
          {isShowClear && <span onClick={handleDeleteFile(index)}>
            <i className="tio-clear"></i>
          </span>}
        </div>
      </div>
    </>
  );
}

FileType.defaultProps = {
  isShowClear: true
};