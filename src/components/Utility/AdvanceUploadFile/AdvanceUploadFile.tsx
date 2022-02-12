import { Model, ModelFilter } from "@react3l/react3l/core";
import React from "react";
import { Observable } from "rxjs";
import { UploadButton } from "./Components/UploadButton/UploadButton";
import { UploadImage } from "./Components/UploadImage/UploadImage";
import { UploadZone } from "./Components/UploadZone/UploadZone";

export interface FileModel {
  id?: number;
  name?: string;
  url?: string;
  appUserId?: number;
  rowId?: string;
  content?: string;
  mimeType?: string;
  isFile?: boolean;
  key?: any;
  path?: string;
  level?: number;
  isDelete?: boolean;
  clearAction?: (fileId: string | number) => void;
  handleInput?: (e: any) => void;
}

export enum UPLOADTYPE {
  BUTTON,
  ZONE,
  IMAGE,
}

export interface AdvanceUploadFileProps<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  type?: UPLOADTYPE;
  autoUpload?: boolean;
  isMultiple?: boolean;
  isMinimized?: boolean;
  files?: FileModel[];
  fileFilter?: (file: unknown, index: number, files: unknown[]) => boolean;
  updateList?: (files: FileModel[]) => void;
  getListFile?: (TModelFilter?: TModelFilter) => Observable<T[]>;
  uploadFile?: (files: File[] | Blob[]) => Observable<FileModel[]>;
  removeFile?: (fileId?: string | number) => Observable<boolean>;
  size?: "large" | "normal" | "small" | "smaller";
}

function AdvanceUploadFile(props: AdvanceUploadFileProps<Model, ModelFilter>) {
  const renderUpload = React.useMemo(() => {
    switch (props.type) {
      case UPLOADTYPE.BUTTON:
        return <UploadButton {...props} />;
      case UPLOADTYPE.ZONE:
        return <UploadZone {...props} />;
      case UPLOADTYPE.IMAGE:
        return <UploadImage {...props} />;
      default:
        return <></>;
    }
  }, [props]);

  return (
    <>
      <div className="upload-file__container">{renderUpload}</div>
    </>
  );
}

AdvanceUploadFile.defaultProps = {
  type: UPLOADTYPE.IMAGE,
  isMultiple: true,
  isMinimized: false,
  autoUpload: false,
  size: "large",
};

export default AdvanceUploadFile;
