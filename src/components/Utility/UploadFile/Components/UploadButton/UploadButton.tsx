import { Model, ModelFilter } from "@react3l/react3l/core";
import React, { RefObject } from "react";
import { UploadFileProps } from "../../UploadFile";
import "./UploadButton.scss";

export interface UploadButtonButtonProps
  extends UploadFileProps<Model, ModelFilter> {
  isMultiple?: boolean;
  uploadContent?: string;
  isViewMode?: boolean;
}

export function UploadButton(props: UploadButtonButtonProps) {
  const { isMultiple, uploadContent, files, isViewMode, updateList } = props;

  const fileRef: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>();

  const handleClickButton = React.useCallback(() => {
    fileRef.current.click();
  }, []);

  const handleChangeFile = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        updateList(files);
      }
    },
    [updateList]
  );

  return (
    <div className="upload-button__container">
      {!isViewMode && (
        <>
          <div onClick={handleClickButton} className="upload-button__button">
            <span>
              <i className="tio-attachment_diagonal"></i> {uploadContent}
            </span>
          </div>
          <input
            type="file"
            style={{ display: "none" }}
            multiple={isMultiple}
            ref={fileRef}
            onChange={handleChangeFile}
          />
        </>
      )}
      <div className="upload-button__list-file mt-2">
        {files &&
          files.length > 0 &&
          files.map((file, index) => (
            <div className="file-container" key={index}>
              <span>
                <i className="tio-documents_outlined"></i>
                {file.name}
              </span>
              {/* <i className="tio-clear"></i> */}
            </div>
          ))}
      </div>
    </div>
  );
}

UploadButton.defaultProps = {
  isMultiple: true,
  uploadContent: "Upload",
  isViewMode: false,
  files: [],
};
