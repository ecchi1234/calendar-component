/* begin general import */
import React from "react";
import nameof from "ts-nameof.macro";
import { Card, Col, Row, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import Modal, { ModalProps } from "components/Utility/Modal/Modal";
import FormItem from "components/Utility/FormItem/FormItem";
import { FormDetailAction, formService } from "services/form-service";
import { ASSETS_SVG } from "config/consts";
/* end general import */

/* begin individual import */
import { Switch } from "antd";
import InputText from "components/Utility/Input/InputText/InputText";
import Select from "components/Utility/Select/Select";
import { Brand } from 'models/Brand';
import { brandRepository } from "repositories/brand-repository";
import { StatusFilter } from 'models/Status';
/* end individual import */

const { TabPane } = Tabs;

interface BrandDetailModalProps extends ModalProps {
  model: Brand;
  onChangeSimpleField: (fieldName: string) => (fieldValue: any) => void;
  onChangeObjectField?: (
    fieldName: string,
  ) => (fieldIdValue: number, fieldValue?: any) => void;
  onChangeTreeObjectField?: (
    fieldName: string,
    callback?: (id: number) => void,
  ) => (list: any[]) => void;
  dispatchModel?: React.Dispatch<FormDetailAction<Brand>>;
  loading?: boolean;
}

function BrandDetailModal(props: BrandDetailModalProps) {
    const [translate] = useTranslation();

    const {
        model,
        onChangeSimpleField,
        onChangeObjectField,
        loading,
    } = props;

    return (
        <Modal
            {...props}
            width={1200}>
            {   loading ?
                (
                    <div className='loading-block'>
                        <img src={ASSETS_SVG + '/spinner.svg'} alt='Loading...' />
                    </div>
                ) :
                (
                    <div className='page page__detail'>
                        <div className='page__modal-header w-100'>
                            <Row className='d-flex'>
                                <Col lg={24}>
                                    {model?.id ? (
                                    <div className='page__title mr-1'>
                                        {translate("brands.detail.title")}
                                    </div>
                                    ) : (
                                        translate("general.actions.create")
                                    )}
                                </Col>
                            </Row>
                        </div>
                        <div className='w-100 page__detail-tabs'>
                            <Row className='d-flex'>
                                <Col lg={24}>
                                    <Card>
                                        <Tabs defaultActiveKey='1'>
                                            <TabPane tab={translate("general.detail.generalInfomation")}
                                                     key='1'>
                                                <Row>
                                                    

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("brands.code")}
                                                                    validateStatus={formService.getValidationStatus<Brand>(model.errors, nameof(model.code))}
                                                                    message={ model.errors?.code }>
                                                                    <InputText isMaterial={true}
                                                                                value={ model.code }
                                                                                placeHolder={translate("brands.placeholder.code")}
                                                                                className={"tio-account_square_outlined"}
                                                                                onChange={onChangeSimpleField(nameof(model.code))} />
                                                        </FormItem>
                                                    </Col>
                                                    

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("brands.name")}
                                                                    validateStatus={formService.getValidationStatus<Brand>(model.errors, nameof(model.name))}
                                                                    message={ model.errors?.name }>
                                                                    <InputText isMaterial={true}
                                                                                value={ model.name }
                                                                                placeHolder={translate("brands.placeholder.name")}
                                                                                className={"tio-account_square_outlined"}
                                                                                onChange={onChangeSimpleField(nameof(model.name))} />
                                                        </FormItem>
                                                    </Col>
                                                    


                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("brands.description")}
                                                                    validateStatus={formService.getValidationStatus<Brand>(model.errors, nameof(model.description))}
                                                                    message={ model.errors?.description }>
                                                                    <InputText isMaterial={true}
                                                                                value={ model.description }
                                                                                placeHolder={translate("brands.placeholder.description")}
                                                                                className={"tio-account_square_outlined"}
                                                                                onChange={onChangeSimpleField(nameof(model.description))} />
                                                        </FormItem>
                                                    </Col>
                                                    




                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("brands.used")}
                                                                    validateStatus={formService.getValidationStatus<Brand>(model.errors, nameof(model.used))}
                                                                    message={ model.errors?.used }>
                                                                    <Switch size='small'
                                                                            onChange={onChangeSimpleField(nameof(model.used))}
                                                                            checked={ model.used } />
                                                        </FormItem>
                                                    </Col>
                                                    


                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("brands.status")}
                                                                    validateStatus={formService.getValidationStatus<Brand>(model.errors, nameof(model.status))}
                                                                    message={ model.errors?.status } >
                                                            <Select isMaterial={true}
                                                                classFilter={ StatusFilter }
                                                                placeHolder={translate("brands.placeholder.status")}
                                                                getList={ brandRepository.singleListStatus }
                                                                onChange={onChangeObjectField(nameof(model.status))}
                                                                model={ model.status } />
                                                        </FormItem>
                                                    </Col>

                                                </Row>
                                            </TabPane>
                                        </Tabs>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                )
            }
        </Modal>
    );
}

export default BrandDetailModal;