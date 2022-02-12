/* begin general import */
import React, { useMemo } from "react";
import { Col, Row, Tooltip, Menu as MenuAntd, Dropdown, Card, Button } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { renderMasterIndex } from "helpers/table";
import { useTranslation } from "react-i18next";
import masterService from "services/pages/master-service";
import { getAntOrderType } from "services/table-service";
import nameof from "ts-nameof.macro";
import { DownOutlined } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";
import InputSearch from "components/Utility/InputSearch/InputSearch";
import Pagination from "components/Utility/Pagination/Pagination";
import AppUserPreview from "./AppUserPreview";
import classNames from "classnames";
/* end general import */

/* begin filter import */
import AdvanceStringFilter from "components/Utility/AdvanceFilter/AdvanceStringFilter/AdvanceStringFilter";
import { StringFilter } from "@react3l/advanced-filters";
import AdvanceIdFilter from "components/Utility/AdvanceFilter/AdvanceIdFilter/AdvanceIdFilter";
import { IdFilter } from "@react3l/advanced-filters";
import AdvanceNumberFilter from "components/Utility/AdvanceFilter/AdvanceNumberFilter/AdvanceNumberFilter";
import { NumberFilter } from "@react3l/advanced-filters";
import { formatNumber } from "helpers/number";
import AdvanceDateFilter from "components/Utility/AdvanceFilter/AdvanceDateFilter/AdvanceDateFilter";
import { DateFilter } from "@react3l/advanced-filters";
import { formatDateTime } from "helpers/date-time";
import { Moment } from "moment";
/* end filter import */

/* begin individual import */
import { appUserRepository } from "repositories/app-user-repository";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Organization, OrganizationFilter } from "models/Organization";
import { Sex, SexFilter } from "models/Sex";
import { Status, StatusFilter } from "models/Status";
import AppUserDetailModal from "../AppUserDetail/AppUserDetailModal";
import detailService from "services/pages/detail-service";
/* end individual import */

function AppUserMaster() {
    const [translate] = useTranslation();

    const {
        list,
        total,
        loadingList,
        filter,
        toggle,
        handleChangeFilter,
        handleResetFilter,
        handleToggleSearch,
        handleTableChange,
        handlePagination,
        handleServerDelete,
        handleServerBulkDelete,
        handleSearch,
        handleImportList,
        handleListExport,
        handleExportTemplateList,
        importButtonRef,
        rowSelection,
        canBulkDelete,
        pagination
    } = masterService.useMaster<AppUser, AppUserFilter>
    (
        AppUserFilter,
        '',
        appUserRepository.list,
        appUserRepository.count,
        appUserRepository.delete,
        appUserRepository.bulkDelete,
    );

    const {
        isOpenPreview,
        isLoadingPreview,
        previewModel,
        handleOpenPreview,
        handleClosePreview,
    } = masterService.usePreview<AppUser>
    (
        AppUser,
        appUserRepository.get,
    );

    const {
        model,
        isOpenDetailModal,
        handleOpenDetailModal,
        handleCloseDetailModal,
        handleSaveModel,
        loadingModel,
        handleChangeSimpleField,
        handleChangeObjectField,
        handleChangeTreeObjectField,
        dispatch,
    } = detailService.useDetailModal(
        AppUser,
        appUserRepository.get,
        appUserRepository.save,
        handleSearch,
    );

    const handleGoCreate = React.useCallback(() => {
        handleClosePreview();
        handleOpenDetailModal(null);
    }, [handleClosePreview, handleOpenDetailModal]);

    const handleGoDetail = React.useCallback((id: number) => () => {
        handleClosePreview();
        handleOpenDetailModal(id);
    }, [handleClosePreview, handleOpenDetailModal]);

    const [dropdown, setDropdown] = React.useState<boolean>(false);

    const handleDropdown = React.useCallback(() => {
        setDropdown(!dropdown);
    }, [dropdown]);

    const menuFilter = React.useMemo(() => (
        <MenuAntd>
            <MenuAntd.Item key="2">
            <Tooltip title={translate("general.button.importExcel")}>
                <>
                <input
                    ref={importButtonRef}
                    type="file"
                    style={ { display: "none" } }
                    id="master-import"
                    onChange={handleImportList(appUserRepository.import)}
                />
                <button
                    className="btn border-less gradient-btn-icon grow-animate-2"
                    onClick={() => {
                    importButtonRef.current.click();
                    }}
                >
                    <i className="tio-file_add_outlined" />
                </button>
                </>
            </Tooltip>
            </MenuAntd.Item>
            <MenuAntd.Item key="3">
            <Tooltip title={translate("general.button.exportExcel")}>
                <button
                className="btn border-less gradient-btn-icon grow-animate-2"
                onClick={handleListExport(filter, appUserRepository.export)}
                >
                <i className="tio-file_outlined" />
                </button>
            </Tooltip>
            </MenuAntd.Item>
            <MenuAntd.Item key="4">
            <Tooltip title={translate("general.button.downloadTemplate")}>
                <button
                className="btn border-less gradient-btn-icon grow-animate-2"
                onClick={handleExportTemplateList(appUserRepository.exportTemplate)}
                >
                <i className="tio-download_to" />
                </button>
            </Tooltip>
            </MenuAntd.Item>
        </MenuAntd>
    ), [translate, importButtonRef, handleImportList, handleListExport, filter, handleExportTemplateList]);

    const menuAction = React.useCallback((id: number, appUser: AppUser) => (
        <MenuAntd>
            <MenuAntd.Item key="1">
                <Tooltip title={translate("general.actions.view")}>
                    <button className="btn gradient-btn-icon"
                            onClick={handleOpenPreview(id)}>
                        <i className="tio-visible" />
                    </button>
                </Tooltip>
            </MenuAntd.Item>
            <MenuAntd.Item key="2">
                <Tooltip title={translate("general.actions.edit")}>
                    <button className="btn gradient-btn-icon"
                            onClick={handleGoDetail(id)}>
                        <i className="tio-edit" />
                    </button>
                </Tooltip>
            </MenuAntd.Item>
            <MenuAntd.Item key="3">
                <Tooltip title={translate("general.actions.delete")}>
                    <button className="btn btn-sm component__btn-delete"
                            onClick={() => handleServerDelete(appUser)}>
                        <i className="tio-delete" />
                    </button>
                </Tooltip>
            </MenuAntd.Item>
        </MenuAntd>
    ), [handleGoDetail, handleOpenPreview, handleServerDelete, translate]);

    const columns: ColumnProps<AppUser>[] = useMemo(
            () => [
                    {
                        title: (<div className='text-center gradient-text'>{translate("general.columns.index")}</div>),
                        key: "index",
                        width: 100,
                        render: renderMasterIndex<AppUser>(pagination),
                    },
                    
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.username')}</div>),
                        key: nameof(list[0].username),
                        dataIndex: nameof(list[0].username),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].username),
                            ),
                    },
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.displayName')}</div>),
                        key: nameof(list[0].displayName),
                        dataIndex: nameof(list[0].displayName),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].displayName),
                            ),
                    },
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.address')}</div>),
                        key: nameof(list[0].address),
                        dataIndex: nameof(list[0].address),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].address),
                            ),
                    },
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.email')}</div>),
                        key: nameof(list[0].email),
                        dataIndex: nameof(list[0].email),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].email),
                            ),
                    },
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.phone')}</div>),
                        key: nameof(list[0].phone),
                        dataIndex: nameof(list[0].phone),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].phone),
                            ),
                    },
                    
                    
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.birthday')}</div>),
                        key: nameof(list[0].birthday),
                        dataIndex: nameof(list[0].birthday),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].birthday),
                            ),
                        render(...params: [Moment, AppUser, number]) {
                            return <div className='text-center'>{formatDateTime(params[0])}</div>;
                        },
                    },
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.avatar')}</div>),
                        key: nameof(list[0].avatar),
                        dataIndex: nameof(list[0].avatar),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].avatar),
                            ),
                    },
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.department')}</div>),
                        key: nameof(list[0].department),
                        dataIndex: nameof(list[0].department),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].department),
                            ),
                    },
                    
                    
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.longitude')}</div>),
                        key: nameof(list[0].longitude),
                        dataIndex: nameof(list[0].longitude),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].longitude),
                            ),
                        render(...params: [number, AppUser, number]) {
                            return <div className='text-right'>{formatNumber(params[0])}</div>;
                        },
                    },
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.latitude')}</div>),
                        key: nameof(list[0].latitude),
                        dataIndex: nameof(list[0].latitude),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].latitude),
                            ),
                        render(...params: [number, AppUser, number]) {
                            return <div className='text-right'>{formatNumber(params[0])}</div>;
                        },
                    },
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.organization')}</div>),
                        key: nameof(list[0].organization),
                        dataIndex: nameof(list[0].organization),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].organization),
                            ),
                        render(organization: Organization) {
                            return organization; //fill the render field after generate code;
                        },
                    },
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.sex')}</div>),
                        key: nameof(list[0].sex),
                        dataIndex: nameof(list[0].sex),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].sex),
                            ),
                        render(sex: Sex) {
                            return sex; //fill the render field after generate code;
                        },
                    },
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('appUsers.status')}</div>),
                        key: nameof(list[0].status),
                        dataIndex: nameof(list[0].status),
                        sorter: true,
                        sortOrder: getAntOrderType<AppUser, AppUserFilter>
                            (
                                filter,
                                nameof(list[0].status),
                            ),
                        render(status: Status) {
                            return status; //fill the render field after generate code;
                        },
                    },
                    
                    
                    
                    
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate("general.actions.label")}</div>),
                        key: "action",
                        dataIndex: nameof(list[0].id),
                        fixed: "right",
                        width: 150,
                        align: "center",
                        render(id: number, appUser: AppUser) {
                            return (
                                <div className='d-flex justify-content-center button-action-table'>
                                    <Dropdown overlay={menuAction(id, appUser)} trigger={["click"]} placement="bottomCenter" arrow>
                                        <span className="action__dots">...</span>
                                    </Dropdown>
                                </div>
                            );
                        },
                    },
                ], [translate, pagination, list, filter, menuAction]);

    return (
        <>
            <div className='page page__master'>
                <div className="page__header d-flex align-items-center justify-content-between">
                    <div className="page__title">
                        {translate('appUsers.master.title')}
                    </div>
                </div>
                <div className="page__search">
                  <Card bordered={false}>
                    <div className="d-flex align-items-center">
                      <div className="d-flex flex-grow-1">
                        <div className="pr-4 w70">
                          <InputSearch />
                        </div>

                        <button
                          className={classNames(
                            "btn component__btn-toggle mr-3 grow-animate-1",
                            toggle === true ? "component__btn-toggle-active" : ""
                          )}
                          onClick={handleToggleSearch}
                        >
                          <i className="tio-tune_horizontal"></i>
                          <span className="component_btn-text">
                            {translate("general.button.advance")}
                          </span>
                        </button>

                        <button
                          className="btn component__btn-toggle grow-animate-1 reset-filter"
                          onClick={handleResetFilter}
                        >
                          <i className="tio-restore reset-icon"></i>
                          <span className="component_btn-text reset-label">
                            {translate("general.button.reset")}
                          </span>
                        </button>
                      </div>

                      <div className="d-flex justify-content-around ml-4">
                        <button
                          className="btn component__btn-toggle grow-animate-1"
                          onClick={handleGoCreate}
                        >
                          <i className="tio-add"></i>
                          <span className="component_btn-text">
                            {translate("general.actions.create")}
                          </span>
                        </button>
                        <div className="table__action">
                          <Dropdown overlay={menuFilter} trigger={["click"]}>
                            <Button onClick={handleDropdown}>
                              <span className="component_btn-text">
                                {translate("general.actions.action")}
                              </span>
                              <DownOutlined className={dropdown ? "dropdown" : null} />
                            </Button>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                    <CSSTransition
                        in={toggle}
                        timeout={100}
                        classNames={"show"}
                        unmountOnExit >
                        <Row className='mt-4'>
                            

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.username') }
                            </label>
                            <AdvanceStringFilter value={filter[nameof(list[0].username)]["contain"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].username),
                                                 'contain' as any,
                                                 StringFilter,
                                                 )}
                                                 placeHolder={translate('appUsers.placeholder.username')} />
                            </Col>
                            

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.displayName') }
                            </label>
                            <AdvanceStringFilter value={filter[nameof(list[0].displayName)]["contain"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].displayName),
                                                 'contain' as any,
                                                 StringFilter,
                                                 )}
                                                 placeHolder={translate('appUsers.placeholder.displayName')} />
                            </Col>
                            

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.address') }
                            </label>
                            <AdvanceStringFilter value={filter[nameof(list[0].address)]["contain"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].address),
                                                 'contain' as any,
                                                 StringFilter,
                                                 )}
                                                 placeHolder={translate('appUsers.placeholder.address')} />
                            </Col>
                            

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.email') }
                            </label>
                            <AdvanceStringFilter value={filter[nameof(list[0].email)]["contain"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].email),
                                                 'contain' as any,
                                                 StringFilter,
                                                 )}
                                                 placeHolder={translate('appUsers.placeholder.email')} />
                            </Col>
                            

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.phone') }
                            </label>
                            <AdvanceStringFilter value={filter[nameof(list[0].phone)]["contain"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].phone),
                                                 'contain' as any,
                                                 StringFilter,
                                                 )}
                                                 placeHolder={translate('appUsers.placeholder.phone')} />
                            </Col>
                            


                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.birthday') }
                            </label>
                            <AdvanceDateFilter value={filter[nameof(list[0].birthday)]["equal"]}
                                               onChange={handleChangeFilter(
                                               nameof(list[0].birthday),
                                               'equal' as any,
                                               DateFilter,
                                               )}
                                               placeholder={translate('appUsers.placeholder.birthday')} />
                            </Col>
                            

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.avatar') }
                            </label>
                            <AdvanceStringFilter value={filter[nameof(list[0].avatar)]["contain"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].avatar),
                                                 'contain' as any,
                                                 StringFilter,
                                                 )}
                                                 placeHolder={translate('appUsers.placeholder.avatar')} />
                            </Col>
                            

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.department') }
                            </label>
                            <AdvanceStringFilter value={filter[nameof(list[0].department)]["contain"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].department),
                                                 'contain' as any,
                                                 StringFilter,
                                                 )}
                                                 placeHolder={translate('appUsers.placeholder.department')} />
                            </Col>
                            


                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.longitude') }
                            </label>
                            <AdvanceNumberFilter value={filter[nameof(list[0].longitude)]["equal"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].longitude),
                                                 'equal' as any,
                                                 NumberFilter,
                                                 )}
                                                 placeHolder={translate('appUsers.placeholder.longitude')} />
                            </Col>
                            

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.latitude') }
                            </label>
                            <AdvanceNumberFilter value={filter[nameof(list[0].latitude)]["equal"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].latitude),
                                                 'equal' as any,
                                                 NumberFilter,
                                                 )}
                                                 placeHolder={translate('appUsers.placeholder.latitude')} />
                            </Col>
                            






                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.organization')}
                            </label>
                            <AdvanceIdFilter value={filter[nameof(list[0].organizationId)]["equal"]}
                                             onChange={handleChangeFilter(
                                             nameof(list[0].organizationId),
                                             'equal' as any,
                                             IdFilter,
                                             )}
                                             classFilter={ OrganizationFilter }
                                             getList={ appUserRepository.singleListOrganization }
                                             placeHolder={translate('appUsers.placeholder.organization')} />
                            </Col>

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.sex')}
                            </label>
                            <AdvanceIdFilter value={filter[nameof(list[0].sexId)]["equal"]}
                                             onChange={handleChangeFilter(
                                             nameof(list[0].sexId),
                                             'equal' as any,
                                             IdFilter,
                                             )}
                                             classFilter={ SexFilter }
                                             getList={ appUserRepository.singleListSex }
                                             placeHolder={translate('appUsers.placeholder.sex')} />
                            </Col>

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('appUsers.status')}
                            </label>
                            <AdvanceIdFilter value={filter[nameof(list[0].statusId)]["equal"]}
                                             onChange={handleChangeFilter(
                                             nameof(list[0].statusId),
                                             'equal' as any,
                                             IdFilter,
                                             )}
                                             classFilter={ StatusFilter }
                                             getList={ appUserRepository.singleListStatus }
                                             placeHolder={translate('appUsers.placeholder.status')} />
                            </Col>



                        </Row>
                    </CSSTransition>
                  </Card>
                </div>
                <div className="page__master-table custom-scrollbar">
                  <Card bordered={false}>
                    <Table
                      rowKey={nameof(list[0].id)}
                      columns={columns}
                      pagination={false}
                      dataSource={list}
                      loading={loadingList}
                      onChange={handleTableChange}
                      rowSelection={rowSelection}
                      scroll={ { y: 400, x: "max-content" } }
                      title={() => (
                        <>
                          <div className="d-flex justify-content-end">
                            <div className="flex-shrink-1 d-flex align-items-center">
                              <Tooltip
                                title={translate("general.button.bulkDelete")}
                                key="bulkDelete"
                              >
                                <button
                                  className="btn border-less component__btn-delete grow-animate-2"
                                  style={ { border: "none", backgroundColor: "unset" } }
                                  onClick={handleServerBulkDelete}
                                  disabled={!canBulkDelete}
                                >
                                  <i className="tio-delete" />
                                </button>
                              </Tooltip>

                              <Pagination
                                skip={filter.skip}
                                take={filter.take}
                                total={total}
                                onChange={handlePagination}
                                style={ { margin: "10px" } }
                              />
                            </div>
                          </div>
                        </>
                      )}
                    />
                  </Card>
                </div>
            </div>
            <AppUserPreview 
                previewModel={previewModel}
                isOpenPreview={isOpenPreview}
                isLoadingPreview={isLoadingPreview}
                handleClosePreview={handleClosePreview}
                handleGoDetail={handleGoDetail}
                translate={translate} />
            <AppUserDetailModal
                model={model}
                visible={isOpenDetailModal}
                handleSave={handleSaveModel}
                handleCancel={handleCloseDetailModal}
                onChangeSimpleField={handleChangeSimpleField}
                onChangeObjectField={handleChangeObjectField}
                onChangeTreeObjectField={handleChangeTreeObjectField}
                dispatchModel={dispatch}
                loading={loadingModel}
                visibleFooter={true}
            />
        </>
    );
}

export default AppUserMaster;
