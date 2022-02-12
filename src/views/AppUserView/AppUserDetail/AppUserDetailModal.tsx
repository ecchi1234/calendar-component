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
import InputText from "components/Utility/Input/InputText/InputText";
import Select from "components/Utility/Select/Select";
import InputNumber, { DECIMAL } from "components/Utility/Input/InputNumber/InputNumber";
import DatePicker from "components/Utility/Calendar/DatePicker/DatePicker";
import TreeSelect from "components/Utility/TreeSelect/TreeSelect";
import { AppUser } from 'models/AppUser';
import { appUserRepository } from "repositories/app-user-repository";
import { OrganizationFilter } from 'models/Organization';
import { SexFilter } from 'models/Sex';
import { StatusFilter } from 'models/Status';
/* end individual import */

const { TabPane } = Tabs;

interface AppUserDetailModalProps extends ModalProps {
  model: AppUser;
  onChangeSimpleField: (fieldName: string) => (fieldValue: any) => void;
  onChangeObjectField?: (
    fieldName: string,
  ) => (fieldIdValue: number, fieldValue?: any) => void;
  onChangeTreeObjectField?: (
    fieldName: string,
    callback?: (id: number) => void,
  ) => (list: any[]) => void;
  dispatchModel?: React.Dispatch<FormDetailAction<AppUser>>;
  loading?: boolean;
}

function AppUserDetailModal(props: AppUserDetailModalProps) {
    const [translate] = useTranslation();

    const {
        model,
        onChangeSimpleField,
        onChangeObjectField,
        onChangeTreeObjectField,
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
                                        {translate("appUsers.detail.title")}
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
                                                        <FormItem label={translate("appUsers.username")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.username))}
                                                                    message={ model.errors?.username }>
                                                                    <InputText isMaterial={true}
                                                                                value={ model.username }
                                                                                placeHolder={translate("appUsers.placeholder.username")}
                                                                                className={"tio-account_square_outlined"}
                                                                                onChange={onChangeSimpleField(nameof(model.username))} />
                                                        </FormItem>
                                                    </Col>
                                                    

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.displayName")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.displayName))}
                                                                    message={ model.errors?.displayName }>
                                                                    <InputText isMaterial={true}
                                                                                value={ model.displayName }
                                                                                placeHolder={translate("appUsers.placeholder.displayName")}
                                                                                className={"tio-account_square_outlined"}
                                                                                onChange={onChangeSimpleField(nameof(model.displayName))} />
                                                        </FormItem>
                                                    </Col>
                                                    

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.address")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.address))}
                                                                    message={ model.errors?.address }>
                                                                    <InputText isMaterial={true}
                                                                                value={ model.address }
                                                                                placeHolder={translate("appUsers.placeholder.address")}
                                                                                className={"tio-account_square_outlined"}
                                                                                onChange={onChangeSimpleField(nameof(model.address))} />
                                                        </FormItem>
                                                    </Col>
                                                    

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.email")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.email))}
                                                                    message={ model.errors?.email }>
                                                                    <InputText isMaterial={true}
                                                                                value={ model.email }
                                                                                placeHolder={translate("appUsers.placeholder.email")}
                                                                                className={"tio-account_square_outlined"}
                                                                                onChange={onChangeSimpleField(nameof(model.email))} />
                                                        </FormItem>
                                                    </Col>
                                                    

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.phone")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.phone))}
                                                                    message={ model.errors?.phone }>
                                                                    <InputText isMaterial={true}
                                                                                value={ model.phone }
                                                                                placeHolder={translate("appUsers.placeholder.phone")}
                                                                                className={"tio-account_square_outlined"}
                                                                                onChange={onChangeSimpleField(nameof(model.phone))} />
                                                        </FormItem>
                                                    </Col>
                                                    


                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.birthday")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.birthday))}
                                                                    message={ model.errors?.birthday }>
                                                                    <DatePicker isMaterial={true}
                                                                                value={ model.birthday }
                                                                                placeholder={translate("appUsers.placeholder.birthday")}
                                                                                onChange={onChangeSimpleField(nameof(model.birthday))} />
                                                        </FormItem>
                                                    </Col>
                                                    

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.avatar")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.avatar))}
                                                                    message={ model.errors?.avatar }>
                                                                    <InputText isMaterial={true}
                                                                                value={ model.avatar }
                                                                                placeHolder={translate("appUsers.placeholder.avatar")}
                                                                                className={"tio-account_square_outlined"}
                                                                                onChange={onChangeSimpleField(nameof(model.avatar))} />
                                                        </FormItem>
                                                    </Col>
                                                    

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.department")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.department))}
                                                                    message={ model.errors?.department }>
                                                                    <InputText isMaterial={true}
                                                                                value={ model.department }
                                                                                placeHolder={translate("appUsers.placeholder.department")}
                                                                                className={"tio-account_square_outlined"}
                                                                                onChange={onChangeSimpleField(nameof(model.department))} />
                                                        </FormItem>
                                                    </Col>
                                                    


                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.longitude")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.longitude))}
                                                                    message={ model.errors?.longitude }>
                                                                    <InputNumber isMaterial={true}
                                                                                    value={ model.longitude }
                                                                                    placeHolder={translate("appUsers.placeholder.longitude")}
                                                                                    onChange={onChangeSimpleField(nameof(model.longitude))}
                                                                                    numberType={DECIMAL} />
                                                        </FormItem>
                                                    </Col>
                                                    

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.latitude")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.latitude))}
                                                                    message={ model.errors?.latitude }>
                                                                    <InputNumber isMaterial={true}
                                                                                    value={ model.latitude }
                                                                                    placeHolder={translate("appUsers.placeholder.latitude")}
                                                                                    onChange={onChangeSimpleField(nameof(model.latitude))}
                                                                                    numberType={DECIMAL} />
                                                        </FormItem>
                                                    </Col>
                                                    






                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.organization")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.organization))}
                                                                    message={ model.errors?.organization } >
                                                            <TreeSelect isMaterial={true}
                                                                    placeHolder={translate("appUsers.placeholder.organization")}
                                                                    selectable={true}
                                                                    classFilter={ OrganizationFilter }
                                                                    onChange={onChangeTreeObjectField(nameof(model.organization))}
                                                                    checkStrictly={true}
                                                                    getTreeData={ appUserRepository.singleListOrganization }
                                                                    item={ model.organization } />
                                                        </FormItem>
                                                    </Col>

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.sex")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.sex))}
                                                                    message={ model.errors?.sex } >
                                                            <Select isMaterial={true}
                                                                classFilter={ SexFilter }
                                                                placeHolder={translate("appUsers.placeholder.sex")}
                                                                getList={ appUserRepository.singleListSex }
                                                                onChange={onChangeObjectField(nameof(model.sex))}
                                                                model={ model.sex } />
                                                        </FormItem>
                                                    </Col>

                                                    <Col lg={12} className='pr-3'>
                                                        <FormItem label={translate("appUsers.status")}
                                                                    validateStatus={formService.getValidationStatus<AppUser>(model.errors, nameof(model.status))}
                                                                    message={ model.errors?.status } >
                                                            <Select isMaterial={true}
                                                                classFilter={ StatusFilter }
                                                                placeHolder={translate("appUsers.placeholder.status")}
                                                                getList={ appUserRepository.singleListStatus }
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

export default AppUserDetailModal;