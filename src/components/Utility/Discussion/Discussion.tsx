import { Model, ModelFilter } from '@react3l/react3l/core';
import { commonService } from '@react3l/react3l/services/common-service';
import { Dropdown } from 'antd';
import Menu from 'antd/lib/menu';
import classNames from 'classnames';
import { ASSETS_SVG } from 'config/consts';
import moment, { Moment } from 'moment';
import React, { RefObject } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { ErrorObserver, forkJoin, Observable } from 'rxjs';
import ContentEditable from '../ChatBox/ContentEditable/ContentEditable';
import Modal from '../Modal/Modal';
import { Creator, FileModel, Message } from './Discussion.model';
import './Discussion.scss';

export interface DiscussionProps <TFilter extends ModelFilter> {
    userInfo: Creator;
    discussionId: string;
    classFilter?: new () => TFilter;
    getMessages?: (TModelFilter?: TFilter) => Observable<Model[]>;
    countMessages?: (TModelFilter?: TFilter) => Observable<number>;
    postMessage?: (Message: Message) => Observable<Message>;
    deleteMessage?: (Message: Message) => Observable<boolean>;
    suggestList?: (filter: TFilter) => Observable<Model[]>;
    attachFile?: (File: File) => Observable<FileModel>;
}

export interface filterAction {
    action: string;
    order?: string;
    skip?: number;
    take?: number;
    data?: ModelFilter;
    discustionId?: string;
}

export interface listAction {
    action: string;
    data?: Message[];
    message?: Message;
}


const sortList = [
    {type: 'latest', title: 'Mới nhất'},
    {type: 'oldest', title: 'Cũ nhất'},
];

const loading = (
    <div className='discussion__loading'>
        <img src={ASSETS_SVG + '/spinner.svg'}  alt='Loading...'/>
    </div>
);

function formatDateTime(
    time: Moment,
    dateTimeFormat: string = 'DD-MM-YYYY HH:mm:ss',
  ) {
    if (!time) return null;
    if (typeof time === "object" && "format" in time) {
      return time.format(dateTimeFormat);
    }
    return moment(time).format(dateTimeFormat);
}

function initFilter (initialValue: any) {
    const {
        discussionId,
        order,
        classFilter,
    } = initialValue;

    const filter = classFilter ? new classFilter() : new ModelFilter();
    return {
        ...filter,
        discussionId,
        order,
    };
}

function updateFilter (state: ModelFilter, filterAction: filterAction): ModelFilter{
    switch (filterAction.action) {
        case "RESET":
            return {
                ...filterAction.data,
                discussionId: filterAction.discustionId,
                order: 'latest',
            };

        case "LOAD_MORE":
            return {
                ...state,
                skip: filterAction.skip,
                take: filterAction.take,
        };

        case "ORDER": 
            return {
                ...state,
                order: filterAction.order,
                skip: 0,
                take: 10,
            };        
    }
};

function updateList (state: Message[], listAction: listAction) {
    switch (listAction.action) {
        case 'UPDATE':
            return [...listAction.data];
        case 'CONCAT':
            const listIDs = new Set(state.map(({ id }) => id));
            const combined = [
                ...state,
                ...listAction.data.filter(({ id }) => !listIDs.has(id)),
            ];
            return combined;
        case 'ADD_SINGLE':
            return [listAction.message, ...state];
    }
}

function Discussion (props: DiscussionProps<ModelFilter>) {
    const {
        userInfo,
        discussionId,
        classFilter: ClassFilter,
        getMessages,
        countMessages,
        postMessage,
        deleteMessage,
        attachFile,
        suggestList,
    } = props;

    const [sortType, setSortType] = React.useState<any>({type: 'latest', title: 'Mới nhất'});

    const [filter, dispatchFilter] = React.useReducer(updateFilter, {discussionId, order: 'lastest', classFilter: ClassFilter}, initFilter);

    const [list, dispatchList] = React.useReducer(updateList, []);

    const [countMessage, setCountMessage] = React.useState<number>();

    const [hasMore, setHasMore] = React.useState<boolean>(true);

    const [subscription] = commonService.useSubscription();

    const [isPreview, setIsPreview] = React.useState<boolean>(false);

    const [imageSrc, setImageSrc] = React.useState<string>();

    const inputRef: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>();

    const contentEditableRef: React.LegacyRef<HTMLDivElement> = React.useRef<HTMLDivElement>();

    const handleClosePreview = React.useCallback(() => {
        setIsPreview(false);
    }, []);

    const handleOpenPreview = React.useCallback((event: any) => {
        const imgSrc = event.target.currentSrc;
        setImageSrc(imgSrc);
        setIsPreview(true);
    }, []);

    const bindEventClick = React.useCallback(() => {
        const imageElements = document.getElementsByName("previewImage");
        const nodes = Array.prototype.slice.call(imageElements,0); 
        if (nodes) {
            [...nodes].forEach((current: Node) => {
                current.addEventListener('click', handleOpenPreview);
            });
        }
    }, [handleOpenPreview]);

    const handleMouseLeave = React.useCallback(() => {
        if (list && list.length > 0) {
            const existPopup = list.filter((currentItem) => { return currentItem.isPopup;});
            if (existPopup.length > 0) {
                const newListMessages = list.map((currentItem) => {
                    currentItem.isPopup = false;
                    return currentItem;
                });
                dispatchList({
                    action: 'UPDATE',
                    data: newListMessages,
                });
            }
            else return;
        }
    }, [list]);
    
    const getListMessages = React.useCallback(() => {
        if (getMessages && countMessages) {
            return forkJoin([
                getMessages(filter),
                countMessages(filter),
              ])
                .subscribe(
                    ([list, total]: [Message[], number]) => {
                        if (list && total) {
                            if(filter.skip > 0) {
                                dispatchList({
                                    action: 'CONCAT',
                                    data: list.reverse(),
                                });
                            } else {
                                dispatchList({
                                    action: 'UPDATE',
                                    data: list.reverse(),
                                });
                            }
                            setTimeout(() => {
                                bindEventClick();
                            }, 200);
                            setCountMessage(total);
                        }
                    },
                );
        }
        return;
    }, [getMessages, countMessages, bindEventClick, filter]);

    const handleMenuClick = React.useCallback((e: any) => {
        const sortType = sortList.filter((current) => current.type === e.key)[0];
        setSortType(sortType);
        dispatchFilter({
            action: 'ORDER',
            order: sortType.type,
        });
    }, []);

    const handleSend = React.useCallback(() => {
        const message = new Message({
            discussionId: discussionId,
            content: contentEditableRef.current.innerHTML,
            creatorId: userInfo.id,
            creator: userInfo,
            createdAt: moment(),
            isOwner: true,
        });
        postMessage(message).subscribe(
            (res: Message) => {
                dispatchList({
                    action: 'ADD_SINGLE',
                    message: res,
                });
                contentEditableRef.current.innerHTML = '';
                setTimeout(() => {
                    bindEventClick();
                }, 200);
            },
            (err: ErrorObserver<Error>) => {},
        );
    }, [userInfo, discussionId, postMessage, bindEventClick]);

    const popupConfirm = React.useCallback(
        (message: Message) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            const newListMessages = list.map((currentItem, index) => {
                if (currentItem.id === message.id ) currentItem.isPopup = true;
                return currentItem;
            });
            dispatchList({
                action: 'UPDATE',
                data: newListMessages,
            });
    }, [list]);

    const handleOk = React.useCallback(
        (message: Message) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const deleteSub = deleteMessage(message).subscribe(
            (res: boolean) => {
                if (res) {
                    const newListMessages = list.filter((currentItem) => {
                        return currentItem.id !== message.id;
                    });
                    dispatchList({
                        action: 'UPDATE',
                        data: newListMessages,
                    });
                }
            },
        );
        subscription.add(deleteSub);
    }, [deleteMessage, subscription, list]);

    const handleCancel = React.useCallback(
        (message: Message) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            const newListMessages = list.map((currentItem) => {
                currentItem.isPopup = false;
                return currentItem;
            });
            dispatchList({
                action: 'UPDATE',
                data: newListMessages,
            });
    }, [list]);

    const handleInfiniteLoad = React.useCallback(() => {
        if (countMessage > list.length) {
            dispatchFilter({
                action: 'LOAD_MORE',
                skip: filter.skip + 10,
                take: filter.take,
            });
        } else {
            setHasMore(false);
        }
    }, [countMessage, list, filter]);

    const setEndContentEditable = React.useCallback(() => {
        var range,selection;
        if(document.createRange)
        {
            range = document.createRange();
            range.setStart(contentEditableRef.current, contentEditableRef.current.childNodes.length);
            range.collapse(true);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, []);

    const handleAttachFile = React.useCallback((selectorFiles: FileList) => {
        if (attachFile && typeof attachFile === 'function') {
            const fileValue = selectorFiles[0];
            inputRef.current.value = null;
            const fileSubcription = attachFile(fileValue).subscribe(
                (res: FileModel) => {
                    if (res) {
                        var hrefItem;
                        const fileType = fileValue.type.split('/')[0];
                        if (fileType === "image") {
                            hrefItem = `<image src="${res.path}" alt="IMG" name="previewImage">`;
                        } else {
                            hrefItem = `<a href="${res.path}" target="_blank">${res.name}</a>`;
                        }
                        contentEditableRef.current.innerHTML += hrefItem;
                        setEndContentEditable();
                    }
                },
                (err) => {
    
                },
            );
            subscription.add(fileSubcription);
        }
    }, [attachFile, subscription, setEndContentEditable]);

    const shortcutName = React.useCallback((name: string) => {
        return name.toUpperCase().substring(0, 1);
    }, []);

    React.useEffect(() => {
        const subcription = getListMessages();
        return () => {
            subcription.unsubscribe();
        };
    }, [getListMessages]);

    const menuSort = React.useMemo(() => {
        return <Menu onClick={handleMenuClick} selectedKeys={[sortType.type]}>
            {sortList.map((item, index) => {
                return <Menu.Item key={item.type}>{item.title.toUpperCase()}</Menu.Item>;
            })}
      </Menu>; 
    }, [handleMenuClick, sortType]);

    return <>
        <div className="discussion__container">
            <div className="discussion__header">
                <div className="discussion__title">
                    <span>{'Bình luận'}</span>
                </div>
                <div className="discussion__sort">
                    <span>SORT:</span>
                    <Dropdown overlay={menuSort} 
                        trigger={['click']}>
                        <div className="sort__options">
                            <span className="sort__page">{sortType?.title.toUpperCase()}</span>
                            <i className="sort__icon tio-chevron_down"></i>
                        </div>
                    </Dropdown>
                </div>
            </div>
            <div className="discussion__body" id="scrollableDiv">
                <InfiniteScroll
                    dataLength={list.length}
                    next={handleInfiniteLoad}
                    style={{ display: 'flex', flexDirection: 'column-reverse'}}
                    inverse={true}
                    hasMore={hasMore}
                    loader={loading}
                    scrollableTarget="scrollableDiv">
                        {
                            list.map((currentItem, index) => {
                                return <div key={index}
                                    onMouseLeave={handleMouseLeave}
                                    className={classNames('discussion__content d-flex mb-4 p-2', (currentItem.isOwner ? 'reverse-row' : 'justify-content-start'))}>
                                    <div className="img-cont-msg">
                                        { currentItem.creator.avatar ? 
                                            <img src={currentItem.creator?.avatar} className="rounded-circle user_img_msg" alt='IMG' /> :
                                            <div className="rounded-circle user_div">{shortcutName(currentItem.creator.displayName)}</div>
                                        }
                                    </div>
                                    <div className={classNames('msg-container', (currentItem.isOwner ? 'msg-container--owner' : 'msg-container--not-owner'))}>
                                        <div dangerouslySetInnerHTML={{ __html: currentItem.content }}/>
                                        <span className="msg-time">{formatDateTime(currentItem.createdAt)}</span>
                                    </div>
                                    {!currentItem.isOwner && <div className="msg-icon">
                                        {currentItem.isPopup ? 
                                            <div className="confirm-box">
                                                <span className="confirm-box__delete-button" onClick={handleOk(currentItem)}>Xóa</span>
                                                <span className="confirm-box__cancel-button" onClick={handleCancel(currentItem)}>Hủy</span>
                                            </div> :
                                            <i className="error-text tio-remove_from_trash" onClick={popupConfirm(currentItem)}></i>
                                        }
                                    </div>}
                                </div>;
                            })
                        }
                </InfiniteScroll>
            </div>
            <div className="discussion__footer">
                <ContentEditable ref={contentEditableRef} 
                    suggestList={suggestList}
                    sendValue={handleSend}/>
                <div className="discussion__action">
                    <input type="file" ref={inputRef} style={{display: 'none'}} onChange={(e) => handleAttachFile(e.target.files)}/>
                    <i className="tio-attachment_diagonal" onClick={() => {inputRef.current.click();}}></i>
                    <button className="btn btn-sm component__btn-primary" onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
        <Modal visible={isPreview}
            width={800}
            visibleFooter={false}
            closable={true}
            handleCancel={handleClosePreview}>
                <div className="preview-image__container">
                    <img alt='img' src={imageSrc}></img>
                </div>
        </Modal>
    </>;
}

export default Discussion;