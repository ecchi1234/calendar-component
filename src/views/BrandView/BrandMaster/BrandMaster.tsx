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
import BrandPreview from "./BrandPreview";
import classNames from "classnames";
/* end general import */

/* begin filter import */
import AdvanceStringFilter from "components/Utility/AdvanceFilter/AdvanceStringFilter/AdvanceStringFilter";
import { StringFilter } from "@react3l/advanced-filters";
import AdvanceIdFilter from "components/Utility/AdvanceFilter/AdvanceIdFilter/AdvanceIdFilter";
import { IdFilter } from "@react3l/advanced-filters";
/* end filter import */

/* begin individual import */
import { brandRepository } from "repositories/brand-repository";
import { Brand, BrandFilter } from "models/Brand";
import { Status, StatusFilter } from "models/Status";
import BrandDetailModal from "../BrandDetail/BrandDetailModal";
import detailService from "services/pages/detail-service";
/* end individual import */

function BrandMaster() {
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
    } = masterService.useMaster<Brand, BrandFilter>
    (
        BrandFilter,
        '',
        brandRepository.list,
        brandRepository.count,
        brandRepository.delete,
        brandRepository.bulkDelete,
    );

    const {
        isOpenPreview,
        isLoadingPreview,
        previewModel,
        handleOpenPreview,
        handleClosePreview,
    } = masterService.usePreview<Brand>
    (
        Brand,
        brandRepository.get,
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
        dispatch,
    } = detailService.useDetailModal(
        Brand,
        brandRepository.get,
        brandRepository.save,
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
                    onChange={handleImportList(brandRepository.import)}
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
                onClick={handleListExport(filter, brandRepository.export)}
                >
                <i className="tio-file_outlined" />
                </button>
            </Tooltip>
            </MenuAntd.Item>
            <MenuAntd.Item key="4">
            <Tooltip title={translate("general.button.downloadTemplate")}>
                <button
                className="btn border-less gradient-btn-icon grow-animate-2"
                onClick={handleExportTemplateList(brandRepository.exportTemplate)}
                >
                <i className="tio-download_to" />
                </button>
            </Tooltip>
            </MenuAntd.Item>
        </MenuAntd>
    ), [translate, importButtonRef, handleImportList, handleListExport, filter, handleExportTemplateList]);

    const menuAction = React.useCallback((id: number, brand: Brand) => (
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
                            onClick={() => handleServerDelete(brand)}>
                        <i className="tio-delete" />
                    </button>
                </Tooltip>
            </MenuAntd.Item>
        </MenuAntd>
    ), [handleGoDetail, handleOpenPreview, handleServerDelete, translate]);

    const columns: ColumnProps<Brand>[] = useMemo(
            () => [
                    {
                        title: (<div className='text-center gradient-text'>{translate("general.columns.index")}</div>),
                        key: "index",
                        width: 100,
                        render: renderMasterIndex<Brand>(pagination),
                    },
                    
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('brands.code')}</div>),
                        key: nameof(list[0].code),
                        dataIndex: nameof(list[0].code),
                        sorter: true,
                        sortOrder: getAntOrderType<Brand, BrandFilter>
                            (
                                filter,
                                nameof(list[0].code),
                            ),
                    },
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('brands.name')}</div>),
                        key: nameof(list[0].name),
                        dataIndex: nameof(list[0].name),
                        sorter: true,
                        sortOrder: getAntOrderType<Brand, BrandFilter>
                            (
                                filter,
                                nameof(list[0].name),
                            ),
                    },
                    
                    
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('brands.description')}</div>),
                        key: nameof(list[0].description),
                        dataIndex: nameof(list[0].description),
                        sorter: true,
                        sortOrder: getAntOrderType<Brand, BrandFilter>
                            (
                                filter,
                                nameof(list[0].description),
                            ),
                    },
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('brands.used')}</div>),
                        key: nameof(list[0].used),
                        dataIndex: nameof(list[0].used),
                    },
                    
                    
                    
                    
                    
                    {
                        title: (<div className='text-center gradient-text'>{translate('brands.status')}</div>),
                        key: nameof(list[0].status),
                        dataIndex: nameof(list[0].status),
                        sorter: true,
                        sortOrder: getAntOrderType<Brand, BrandFilter>
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
                        render(id: number, brand: Brand) {
                            return (
                                <div className='d-flex justify-content-center button-action-table'>
                                    <Dropdown overlay={menuAction(id, brand)} trigger={["click"]} placement="bottomCenter" arrow>
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
                        {translate('brands.master.title')}
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
                                { translate('brands.code') }
                            </label>
                            <AdvanceStringFilter value={filter[nameof(list[0].code)]["contain"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].code),
                                                 'contain' as any,
                                                 StringFilter,
                                                 )}
                                                 placeHolder={translate('brands.placeholder.code')} />
                            </Col>
                            

                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('brands.name') }
                            </label>
                            <AdvanceStringFilter value={filter[nameof(list[0].name)]["contain"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].name),
                                                 'contain' as any,
                                                 StringFilter,
                                                 )}
                                                 placeHolder={translate('brands.placeholder.name')} />
                            </Col>
                            


                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('brands.description') }
                            </label>
                            <AdvanceStringFilter value={filter[nameof(list[0].description)]["contain"]}
                                                 onEnter={handleChangeFilter(
                                                 nameof(list[0].description),
                                                 'contain' as any,
                                                 StringFilter,
                                                 )}
                                                 placeHolder={translate('brands.placeholder.description')} />
                            </Col>
                            




                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('brands.used') }
                            </label>
                            </Col>
                            


                            <Col lg={4} className='pr-4'>
                            <label className='label'>
                                { translate('brands.status')}
                            </label>
                            <AdvanceIdFilter value={filter[nameof(list[0].statusId)]["equal"]}
                                             onChange={handleChangeFilter(
                                             nameof(list[0].statusId),
                                             'equal' as any,
                                             IdFilter,
                                             )}
                                             classFilter={ StatusFilter }
                                             getList={ brandRepository.singleListStatus }
                                             placeHolder={translate('brands.placeholder.status')} />
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
            <BrandPreview 
                previewModel={previewModel}
                isOpenPreview={isOpenPreview}
                isLoadingPreview={isLoadingPreview}
                handleClosePreview={handleClosePreview}
                handleGoDetail={handleGoDetail}
                translate={translate} />
            <BrandDetailModal
                model={model}
                visible={isOpenDetailModal}
                handleSave={handleSaveModel}
                handleCancel={handleCloseDetailModal}
                onChangeSimpleField={handleChangeSimpleField}
                onChangeObjectField={handleChangeObjectField}
                
                dispatchModel={dispatch}
                loading={loadingModel}
                visibleFooter={true}
            />
        </>
    );
}

export default BrandMaster;
