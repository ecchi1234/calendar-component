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
import { AppUser } from 'models/AppUser';
/* end individual import */

interface AppUserPreviewProps<T extends Model>
    {
    previewModel?: T;
    isOpenPreview?: boolean;
    isLoadingPreview?: boolean;
    handleClosePreview?: () => void;
    handleGoDetail?: (id: number) => () => void;
    translate?: TFunction;
    };

    function AppUserPreview(props: AppUserPreviewProps<AppUser>
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
                                    <span className="preview__header-date">{translate('appUsers.startDate')} { previewModel.startDate ? moment(previewModel.startDate).format('DD/MM/YYYY') : null }</span>
                                </div>
                                <button className="btn gradient-btn-icon ant-tooltip-open" onClick={handleGoDetail(previewModel.id)}>
                                    <i className="tio-edit"></i>
                                </button>
                            </div>
                        </div>
                        <div className="preview__body">
                            <div className="preview__content">
                                <Descriptions title={previewModel.name} column={2}>
                                    <Descriptions.Item label={translate('appUsers.username')}>
                                        <span className="gradient-text">{ previewModel.username }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.displayName')}>
                                        <span className="gradient-text">{ previewModel.displayName }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.address')}>
                                        <span className="gradient-text">{ previewModel.address }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.email')}>
                                        <span className="gradient-text">{ previewModel.email }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.phone')}>
                                        <span className="gradient-text">{ previewModel.phone }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.birthday')}>
                                        <span className="gradient-text">
                                            { previewModel.birthday ? moment(previewModel.birthday).format('DD/MM/YYYY') : null }
                                        </span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.avatar')}>
                                        <span className="gradient-text">{ previewModel.avatar }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.department')}>
                                        <span className="gradient-text">{ previewModel.department }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.longitude')}>
                                        <span className="gradient-text">{ previewModel.longitude }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.latitude')}>
                                        <span className="gradient-text">{ previewModel.latitude }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.organization')}>
                                        <span className="gradient-text">{ previewModel?.organization?.name }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.sex')}>
                                        <span className="gradient-text">{ previewModel?.sex?.name }</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={translate('appUsers.status')}>
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

export default AppUserPreview;
