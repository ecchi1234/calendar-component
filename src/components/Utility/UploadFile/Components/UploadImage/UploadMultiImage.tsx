import { Model, ModelFilter } from "@react3l/react3l/core";
import React, { Reducer, RefObject } from 'react';
import { useDropzone } from "react-dropzone";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { UploadFileProps } from "../../UploadFile";
import uploadImage from './../../../../../assets/images/upload.svg';
import CroppedModal, { ImageResult } from "./CroppedModal/CroppedModal";
import './UploadImage.scss';
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
        case 'UPDATE':
            return [...state, action.data];
        case 'RESET':
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

const fileReducer = (state: JSX.Element[], action: FileAction): JSX.Element[] => {
    switch (action.type) {
        case 'UPDATE':
            return [...state, action.data];
        case 'BULK_UPDATE':
            return [...action.datas];
        default:
            return [...state];
    }
};

export interface UploadMultiImageProps extends UploadFileProps<Model, ModelFilter> {

}

export function UploadMultiImage(props: UploadMultiImageProps) {
    const {
        files,
        getListFile,
        uploadFile,
        updateList
    } = props;

    const fileRef: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>();

    const [menuFile, dispatchMenuFile] = React.useReducer<Reducer<JSX.Element[], FileAction>>(fileReducer, []);

    const [listImage, dispatch] = React.useReducer<Reducer<ImageFile[], ImageAction>>(imageReducer, []);

    const [isPreview, setIsPreview] = React.useState<boolean>(false);

    const handleClosePreview = React.useCallback(() => {
        setIsPreview(false);
        dispatch({
            type: 'RESET'
        });
    }, []);

    const handleSaveCropped = React.useCallback((imageCroppedList: ImageResult[]) => {
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
    }, [uploadFile, updateList]);

    const onDrop = React.useCallback(acceptedFiles => {
        const listFiles = acceptedFiles as File[];
        listFiles.forEach(file => {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                dispatch({
                    type: 'UPDATE',
                    data: {
                        fileId: file.name,
                        file: file,
                        fileUrl: fileReader.result
                    }
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
        if (typeof getListFile === 'function') {
            getListFile().subscribe((res) => {
            }, (err) => {
            });
        } else {
            if (files && files.length) {
                files.forEach((file) => {
                    file.clearAction = function () {

                    };
                });
                const menus = Menu(files);
                dispatchMenuFile({
                    type: 'BULK_UPDATE',
                    datas: menus
                });
            }
        }
    }, [getListFile, files]);

    return <>
        <div className="upload-image__container">
            <div className="upload-image__drop-zone">
                <div className="upload-image__drop-zone-inside" {...getRootProps()}>
                    <img src={uploadImage} alt="icon"></img>
                    <input type="file" ref={fileRef} style={{ display: 'none' }} {...getInputProps()} />
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
        {   listImage &&
            <CroppedModal
                visible={isPreview}
                handleCancel={handleClosePreview}
                handleSave={handleSaveCropped}
                listImage={listImage} />
        }
    </>;
}

