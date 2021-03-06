import { Model, ModelFilter } from "@react3l/react3l/core";
import React, { Reducer, RefObject } from "react";
import { useDropzone } from "react-dropzone";
import { AdvanceUploadFileProps } from "../../AdvanceUploadFile";
import uploadImage from "./../../../../../assets/images/upload-file/upload.svg";
import editImage from "./../../../../../assets/images/upload-file/edit.svg";
import CroppedModal, { ImageResult } from "./CroppedModal/CroppedModal";
import "./UploadImage.scss";
import { Menu } from "./UploadImageComponents";
import classNames from "classnames";

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
      return [...state, action.data];
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
  id?: number;
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
    case "DELETE":
      return [...state.filter((item) => item.props.id !== action.id)];
    default:
      return [...state];
  }
};

export interface UploadImageProps extends AdvanceUploadFileProps<Model, ModelFilter> { }

export function UploadImage(props: UploadImageProps) {
  const {
    size,
    isMultiple,
    isMinimized,
    files,
    getListFile,
    uploadFile,
    removeFile,
    updateList,
  } = props;

  const fileRef: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(
    null
  );

  const [menuFile, dispatchMenuFile] = React.useReducer<
    Reducer<JSX.Element[], FileAction>
  >(fileReducer, []);

  const [listImage, dispatch] = React.useReducer<
    Reducer<ImageFile[], ImageAction>
  >(imageReducer, []);

  const [isPreview, setIsPreview] = React.useState<boolean>();

  const handleInput = React.useCallback(
    (event: any) => {
      if (listImage.length > 0) {
        event.stopPropagation();
        setIsPreview(true);
      }
    },
    [listImage.length]
  );

  const handleNewInput = React.useCallback((event: any) => {
    event.stopPropagation();
    setIsPreview(true);
  }, []);

  const handleClosePreview = React.useCallback(() => {
    setIsPreview(false);
  }, []);


  const handleSaveCropped = React.useCallback(
    (imageCroppedList: ImageResult[]) => {
      if (imageCroppedList && imageCroppedList.length) {
        let files: Blob[] = [];
        imageCroppedList.forEach((currentImage) => {
          files.push(currentImage.file);
        });
        uploadFile(files).subscribe((res) => {
          if (res) {
            updateList(res);
          }
        });
      }
    },
    // []
    [uploadFile, updateList]
  );

  const handleClearItem = React.useCallback(
    (fileId: string | number) => {
      removeFile(fileId).subscribe((res) => {
        if (res) {
          updateList(files.filter((item) => item.id !== fileId));
        }
      });
    },
    [files, removeFile, updateList]
  );

  const onDrop = React.useCallback(
    (acceptedFiles) => {
      let listFiles = acceptedFiles as File[];
      if (!isMultiple) listFiles.length = 1;
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
    },
    [isMultiple]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  React.useEffect(() => {
    if (typeof getListFile === "function") {
      getListFile().subscribe(
        (res) => { },
        (err) => { }
      );
    } else {
      if (files && files.length) {
        let loadedFiles = [...files];
        if (!isMultiple) {
          loadedFiles.length = 1;
        }
        loadedFiles.forEach((file) => {
          file.clearAction = handleClearItem;
        });
        const menus = Menu(loadedFiles, handleNewInput);
        dispatchMenuFile({
          type: "BULK_UPDATE",
          datas: menus,
        });
      }
    }
  }, [
    getListFile,
    files,
    isMultiple,
    removeFile,
    handleClearItem,
    handleNewInput,
  ]);
  return (
    <>
      <div
        className={classNames(`upload-image__container--advance upload-image--${size}`, {
          multiple: isMultiple && !isMinimized,
          minimized: isMultiple && isMinimized,
        })}
      >
        <div className="upload-image__drop-zone" {...getRootProps()}>
          {isMultiple && !isMinimized && (
            <div className="upload-image__list" onClick={handleInput}>
              {menuFile.map((menu) => (
                <>{menu}</>
              ))}
              <img className="upload-icon" src={uploadImage} alt="icon"></img>
            </div>
          )}
          {isMultiple && isMinimized && (
            <>
              {files.length > 0 ? (
                <div
                  style={{
                    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${files[0].path})`,
                    backgroundSize: "cover",
                  }}
                  className="upload-image--minimized"
                >
                  <div className="upload-image--minimized__num">
                    {files.length > 1 ? `${files.length - 1}+` : ""}
                  </div>
                  <div className="upload-image--minimized__act">
                    <img src={editImage} alt="icon" onClick={handleInput} />
                  </div>
                </div>
              ) : (
                <div onClick={handleInput}>
                  <img
                    className="upload-icon"
                    src={uploadImage}
                    alt="icon"
                  ></img>
                </div>
              )}
            </>
          )}
          {!isMultiple && (
            <>
              {files.length === 0 ? (
                <div onClick={handleInput}>
                  <img
                    className="upload-icon"
                    src={uploadImage}
                    alt="icon"
                  ></img>
                </div>
              ) : (
                <div className="upload-image__list">
                  <img
                    src={files[0]?.url}
                    alt="img"
                    width="100%"
                    height="100%"
                    onClick={handleInput}
                  ></img>
                </div>
              )}
            </>
          )}
          <input
            type="file"
            ref={fileRef}
            style={{ display: "none" }}
            {...getInputProps()}
          />
          {isMultiple && !isMinimized && (
            <p>
              <span style={{ color: "#0062FF", cursor: "pointer" }}>
                T???i ???nh
              </span>{" "}
              ho???c k??o th??? ????? th??m ???nh.
            </p>
          )}
        </div>
      </div>
      {listImage && (
        <CroppedModal
          visible={isPreview}
          handleCancel={handleClosePreview}
          handleSave={handleSaveCropped}
          listImage={listImage}
          isMultiple={isMultiple}
        />
      )}
    </>
  );
}
