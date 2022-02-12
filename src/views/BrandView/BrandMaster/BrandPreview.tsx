/* begin general import */
import React from 'react';
import { Model } from '@react3l/react3l/core/model';
import { Descriptions } from 'antd';
import Modal from 'components/Utility/Modal/Modal';
import { TFunction } from 'i18next';
import moment from "moment";
import { ASSETS_IMAGE } from "config/consts";
/* end general import */

/* begin individual import */
import { Brand } from 'models/Brand';
/* end individual import */

interface BrandPreviewProps<T extends Model>
    {
    previewModel?: T;
    isOpenPreview?: boolean;
    isLoadingPreview?: boolean;
    handleClosePreview?: () => void;
    handleGoDetail?: (id: number) => () => void;
    translate?: TFunction;
    };

    function BrandPreview(props: BrandPreviewProps<Brand>
        ) {

        const {
        previewModel,
        isOpenPreview,
        isLoadingPreview,
        handleClosePreview,
        handleGoDetail,
        translate,
        } = props;

        return <>
            <Modal title={null}
                    visible={isOpenPreview}
                    handleCancel={handleClosePreview}
                    width={1200}
                    visibleFooter={false}>
                { isLoadingPreview ?
                <div className="loading-block">
                    <img src="/assets/svg/spinner.svg" alt='Loading...' />
                </div> :
                <div className="preview__containter">
                    <div className="preview__left-side">
                        <div className="preview__header">
                            <div className="preview__vertical-bar"></div>
                            <div className="preview__header-info">
                                <div className="preview__header-text">
                                    <span className="preview__header-title">{previewModel.name}</span>
                                    <span className="preview__header-date">{translate('brands.startDate')} { previewModel.startDate ? moment(previewModel.startDate).format('DD/MM/YYYY') : null }</span>
                                </div>
                                <button className="btn gradient-btn-icon ant-tooltip-open" onClick={handleGoDetail(previewModel.id)}>
                                    <i className="tio-edit"></i>
                                </button>
                            </div>
                        </div>
                        <div className="preview__body">
                            <div className="preview__content">
                                <Descriptions title={previewModel.name} column={2}>
                                    <Descriptions.Item label={translate('brands.code')}>
                                        <span className="gradient-text">{ previewModel.code }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('brands.name')}>
                                        <span className="gradient-text">{ previewModel.name }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('brands.description')}>
                                        <span className="gradient-text">{ previewModel.description }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('brands.used')}>
                                        <span className="gradient-text">{ previewModel.used }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('brands.status')}>
                                        <span className="gradient-text">{ previewModel?.status?.name }</span>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                            <div className="preview__content">
                                <img src={ASSETS_IMAGE + "/img.png"} alt="no-data" />
                                <span className="gradient-text transform-text">Have a nice day!</span>
                            </div>
                        </div>
                        <div className="preview__footer"></div>
                    </div>
                    <div className="preview__right-side">
                    </div>
                </div>
                }
            </Modal>
        </>;
}

export default BrandPreview;
