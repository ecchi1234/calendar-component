import { Model, ModelFilter } from "@react3l/react3l/core";
import React, { Reducer, RefObject } from "react";
import { useDropzone } from "react-dropzone";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { Observable } from "rxjs";
import { FileModel, UploadFileProps } from "../../UploadFile";
import uploadImage from "./../../../../../assets/images/upload.svg";
import CroppedModal, { ImageResult } from "./CroppedModal/CroppedModal";
import "./UploadImage.scss";
import { ArrowLeft, ArrowRight, Menu } from "./UploadImageComponents";

export interface ImageFile {
  fileId: string | number;
  file: File;
  fileUrl: string | ArrayBuffer;
}

interface ImageAction {
  type: string;
  data?: ImageFile;
}

const imageReducer = (state: ImageFile[], action: ImageAction): ImageFile[] => {
  switch (action.type) {
    case "UPDATE":
      return [action.data];
    case "RESET":
      return [];
    default:
      return [...state];
  }
};
interface FileAction {
  type: string;
  data?: JSX.Element;
  datas?: JSX.Element[];
}

const fileReducer = (
  state: JSX.Element[],
  action: FileAction
): JSX.Element[] => {
  switch (action.type) {
    case "UPDATE":
      return [...state, action.data];
    case "BULK_UPDATE":
      return [...action.datas];
    default:
      return [...state];
  }
};

export interface UploadImageProps<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  files?: FileModel[];
  fileFilter?: (file: unknown, index: number, files: unknown[]) => boolean;
  updateList?: (files: File[] | FileList) => void;
  getListFile?: (TModelFilter?: TModelFilter) => Observable<T[]>;
  uploadFile?: (files: File | Blob) => Observable<File>;
  removeFile?: (TModelFilter?: TModelFilter) => Observable<boolean>;
}

export function UploadImage(props: UploadFileProps<Model, ModelFilter>) {
  const { files, getListFile, onUploadImage, updateList } = props;

  const fileRef: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>();

  const [menuFile, dispatchMenuFile] = React.useReducer<
    Reducer<JSX.Element[], FileAction>
  >(fileReducer, []);

  const [listImage, dispatch] = React.useReducer<
    Reducer<ImageFile[], ImageAction>
  >(imageReducer, []);

  const [isPreview, setIsPreview] = React.useState<boolean>(false);

  const handleClosePreview = React.useCallback(() => {
    setIsPreview(false);
    dispatch({
      type: "RESET",
    });
  }, []);

  const handleSaveCropped = React.useCallback(
    (imageCroppedList: ImageResult[]) => {
      if (imageCroppedList && imageCroppedList.length) {
        const file = imageCroppedList[imageCroppedList.length - 1].file;
        files.push(file);
        onUploadImage(file).subscribe((res) => {
          if (res) {
            updateList([res]);
            setIsPreview(false);
          }
        });
      }
    },
    [files, onUploadImage, updateList]
  );

  const onDrop = React.useCallback((acceptedFiles) => {
    const listFiles = acceptedFiles as File[];

    listFiles.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        dispatch({
          type: "UPDATE",
          data: {
            fileId: file.name,
            file: file,
            fileUrl: fileReader.result,
          },
        });
      };
      if (file) {
        fileReader.readAsDataURL(file);
      }
    });
    setIsPreview(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  React.useEffect(() => {
    if (typeof getListFile === "function") {
      getListFile().subscribe(
        (res) => {},
        (err) => {}
      );
    } else {
      if (files && files.length) {
        const newFiles = files.map((item) => {
          item.path = item.url;
          return item;
        });
        const menus = Menu(newFiles);
        dispatchMenuFile({
          type: "BULK_UPDATE",
          datas: menus,
        });
      }
    }
  }, [getListFile, files]);

  return (
    <>
      <div className="upload-image__container">
        <div className="upload-image__drop-zone">
          <div className="upload-image__drop-zone-inside" {...getRootProps()}>
            <img src={uploadImage} alt="icon"></img>
            <input
              type="file"
              ref={fileRef}
              style={{ display: "none" }}
              {...getInputProps()}
            />
          </div>
        </div>
        <div className="upload-image__list">
          <ScrollMenu
            alignCenter={false}
            data={menuFile}
            arrowLeft={ArrowLeft}
            arrowRight={ArrowRight}
          />
        </div>
      </div>
      {listImage && (
        <CroppedModal
          visible={isPreview}
          handleCancel={handleClosePreview}
          handleSave={handleSaveCropped}
          listImage={listImage}
        />
      )}
    </>
  );
}
