import React, { Fragment, useContext } from "react";
import man from "../../assets/images/dashboard/profile.jpg";
import { LogIn, User } from "react-feather";
import authenticationService from "services/authentication-service";
// import { AppAction, AppState } from "app/app-store";
import { SignalRContext } from "app/app-context";
import { useRightBarHook } from "./rightbar-hook";
import useApp from "app/app-hook";
import { formatDateTime } from "helpers/date-time";
import InfiniteScroll from "react-infinite-scroll-component";
import { Bell } from "react-feather";

export const SIGNALR_CHANNEL: string = "Receive";

const Rightbar = () => {
  // const [state] = useContext<[AppState, Dispatch<AppAction>]>(AppStoreContext);

  const handleLogout = React.useCallback(() => {
    authenticationService.logout();
  }, []);
  // const [notificationDropDown, setNotificationDropDown] = useState(false);
  const signalRContext = useContext(SignalRContext);

  const { state } = useApp();

  const {
    handleToggleNotification,
    notificationDropDown,
    notifications,
    hasMore,
    total,
    loadingNotification,
    handleInfiniteOnLoad,
    handleMouseLeaveAll,
    handleReadNotification,
    buildAbsoluteLink,
    unreadNotification,
  } = useRightBarHook(signalRContext, SIGNALR_CHANNEL);

  return (
    <Fragment>
      <div className="nav-right col-8 pull-right right-header p-0">
        <ul className="nav-menus">
          <li className="notification-nav onhover-dropdown on-click-dropdown">
            <div
              className="notification-box"
              onClick={handleToggleNotification}
            >
              <Bell />
              <span className="badge badge-pill badge-secondary">
                {unreadNotification}
              </span>
            </div>

            <ul
              className={`notification-dropdown on-click-show-div ${
                notificationDropDown ? "active" : ""
              }`}
              onMouseLeave={handleMouseLeaveAll}
            >
              <>
                <li className="title">
                  <h6 className="f-18 mb-0">Thông báo</h6>
                </li>
                <ul className="notifications">
                  <InfiniteScroll
                    dataLength={notifications.length}
                    next={handleInfiniteOnLoad}
                    hasMore={true}
                    height={600}
                    loader={loadingNotification && notifications.length > 5}
                  >
                    {
                      <div className="notifications d-flex flex-column align-item-center">
                        {notifications &&
                          notifications?.length > 0 &&
                          notifications?.map((notification, index) => (
                            <li
                              key={index}
                              onClick={handleReadNotification(
                                notification.id,
                                notification.linkWebsite
                                  ? `${buildAbsoluteLink(
                                      notification.linkWebsite
                                    )}`
                                  : "#"
                              )}
                            >
                              <div className="d-flex align-items-center ">
                                <div>
                                  <i className="tio-shop_outlined mr-3 font-primary">
                                    {" "}
                                  </i>
                                </div>
                                <div className="pull-right">
                                  <div>{notification?.contentWeb}</div>
                                  <b>{formatDateTime(notification?.time)}</b>
                                </div>
                              </div>
                            </li>
                          ))}
                        {!hasMore && (
                          <div
                            className="d-flex justify-content-center p-2"
                            style={{ background: "#e8e8e8", fontSize: 12 }}
                          >
                            Đã hiển thị tất cả <b>&nbsp;{total}&nbsp;</b> thông
                            báo
                          </div>
                        )}
                      </div>
                    }
                  </InfiniteScroll>
                </ul>

                {!notifications?.length &&
                  !loadingNotification &&
                  notificationDropDown && (
                    <div className="d-flex justify-content-center">
                      <div className="no-data-item">Không có dữ liệu</div>
                    </div>
                  )}
              </>
            </ul>
          </li>

          <li className="profile-nav onhover-dropdown p-0">
            <div className="media profile-media">
              <img
                className="b-r-10"
                src={state?.user?.avatar ? state?.user?.avatar : man}
                alt=""
              />
              <div className="media-body">
                <span>
                  {" "}
                  {state?.user ? state?.user?.displayName : "Emay Walter"}
                </span>
                <p className="mb-0 font-roboto">
                  {state?.user ? state?.user?.username : "Administrator"}{" "}
                  <i className="middle fa fa-angle-down"></i>
                </p>
              </div>
            </div>
            <ul className="profile-dropdown onhover-show-div">
              <li>
                <User />
                <span>Thông tin </span>
              </li>
              <li onClick={() => handleLogout()}>
                <LogIn />
                <span>Đăng xuất</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </Fragment>
  );
};
export default Rightbar;
