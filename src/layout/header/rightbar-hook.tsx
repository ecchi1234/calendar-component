import { Model } from "@react3l/react3l/core";
import useApp from "app/app-hook";
import { DEFAULT_TAKE } from "config/consts";
import {
  CHANGE_PASSWORD_ROUTE,
  PROFILE_ROUTE,
  USER_NOTIFICATION_ROUTE,
} from "config/route-consts";
import { AppUser, AppUserFilter } from "models/AppUser";
import path from "path";
import React, { useEffect } from "react";
import { userNotificationRepository } from "repositories/user-notification-repository";
import authenticationService from "services/authentication-service";
import { SignalRService } from "services/signalr-service";
import notification from "antd/lib/notification";

export class Site extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public icon?: string;
}

export class AppUserSiteMapping extends Model {
  public appUserId?: number;
  public siteId?: number;
  public enabled?: boolean;
  public site?: Site;
}

export function useRightBarHook(service, channel) {
  // const [subscription] = commonService.useSubscription();

  const { state } = useApp();

  const [notificationFilter, setNotificationFilter] = React.useState<
    AppUserFilter
  >(new AppUserFilter());

  const [notificationDropDown, setNotificationDropDown] = React.useState(false);

  const [notifications, setNotifications] = React.useState<AppUser[]>([]);

  const [fetchNotification, setFetchNotification] = React.useState<boolean>(
    false
  );

  const [loadingNotification, setLoadingNotification] = React.useState<boolean>(
    false
  );

  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const [total, setTotal] = React.useState<number>(0);

  const [gatewayDropDown, setGatewayDropDown] = React.useState(false);

  const [profileDrop, setProfileDrop] = React.useState(false);
  const [subcribe, setSubcribe] = React.useState<boolean>(true);
  const [unreadNotification, setUnreadNotification] = React.useState<number>(0);

  const notificationConfig = (data: any) => {
    return notification.success({
      message: (
        <div
          className="content-noti-ellipsis"
          dangerouslySetInnerHTML={{
            __html: data.titleWeb,
          }}
        ></div>
      ),

      description: (
        <div
          className="content-noti-ellipsis"
          dangerouslySetInnerHTML={{
            __html: data.contentWeb,
          }}
        ></div>
      ),
      icon: (
        <>
          {data?.siteId === 1 && (
            <div
              style={{
                background: "#7d71f1",
                width: 35,
                height: 35,
                lineHeight: "35px",
                borderRadius: "50%",
                margin: "auto",
                textAlign: "center",
                color: "#ffffff",
              }}
              className="icon-toast-portal ml-1 mr-3"
            >
              <i className="tio-shop_outlined" />
            </div>
          )}

          {data?.siteId === 5 && (
            <div
              style={{
                background: "#23282c",
                width: 35,
                height: 35,
                lineHeight: "35px",
                borderRadius: "50%",
                margin: "auto",
                textAlign: "center",
                color: "#ffffff",
              }}
              className="icon-toast-mdm ml-1 mr-3"
            >
              <i className="tio-shop_outlined" />
            </div>
          )}
          {data?.siteId === 8 && (
            <div
              style={{
                background: "#3f8cff",
                width: 35,
                height: 35,
                lineHeight: "35px",
                borderRadius: "50%",
                margin: "auto",
                textAlign: "center",
                color: "#ffffff",
              }}
              className="ml-1 mr-3 mt-2"
            >
              <i className="tio-shop_outlined" />
            </div>
          )}
        </>
      ),
      onClick: async () => {
        await userNotificationRepository.read(data.id);
        setTimeout(() => {
          window.location.href = data.linkWebsite
            ? buildAbsoluteLink(data.linkWebsite)
            : "#";
        }, 0);
      },
    });
  };

  useEffect(() => {
    const cancelled = false;
    if (fetchNotification) {
      const fetchData = async () => {
        await setLoadingNotification(true);

        await userNotificationRepository
          .list(notificationFilter)
          .subscribe((res) => {
            if (!cancelled) {
              setNotifications([...res]);
            }
          });

        await userNotificationRepository
          .count(notificationFilter)
          .subscribe((res) => {
            if (!cancelled) {
              setTotal(res);
            }
          });

        await setFetchNotification(false);
        await setLoadingNotification(false);
      };
      fetchData();
    }
  }, [fetchNotification, notificationFilter, total]);

  const fetchUnreadNotification = React.useCallback(async () => {
    try {
      await userNotificationRepository
        .countUnread(notificationFilter)
        .subscribe((res) => {
          setUnreadNotification(res);
        });
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(`ex:`, ex);
    }
  }, [notificationFilter]);

  const subcribeChannel = React.useCallback(
    (signalRService: SignalRService, channel: string) => {
      return signalRService.registerChannel(channel, (data: any) => {
        // eslint-disable-next-line no-console
        console.log(`data`, data);
        fetchUnreadNotification();
        // fire toast to notice new notification
        notificationConfig(data);
      });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    fetchUnreadNotification();
  }, [fetchUnreadNotification]);
  useEffect(() => {
    if (subcribe) {
      subcribeChannel(service, channel);
      setSubcribe(false);
    }
  }, [channel, service, subcribe, subcribeChannel]);
  const handleLogout = React.useCallback(() => {
    authenticationService.logout();
  }, []);

  const handleClickToProfile = React.useCallback(() => {
    window.location.href = PROFILE_ROUTE;
  }, []);

  const handleClickToChangePassword = React.useCallback(() => {
    window.location.href = CHANGE_PASSWORD_ROUTE;
  }, []);

  const handleClickToNotification = React.useCallback(() => {
    window.location.href = USER_NOTIFICATION_ROUTE;
  }, []);

  /* handleToggerNotification */
  const handleToggleNotification = React.useCallback(() => {
    /* if notification is closing, set fetch data = true */
    if (!notificationDropDown) {
      setNotificationFilter({
        ...notificationFilter,
        skip: 0,
        take: DEFAULT_TAKE,
      });
      setHasMore(true);
      setFetchNotification(true);
    }
    // setNotifications([]);
    setNotificationDropDown(!notificationDropDown);
  }, [notificationDropDown, notificationFilter]);

  /* handleInfiniteOnLoad */
  const handleInfiniteOnLoad = React.useCallback(() => {
    if (notificationFilter.skip + 10 >= total) {
      setLoadingNotification(false);
      setHasMore(false);
      return;
    }
    /* fetch notification with effect */
    const fetch = async () => {
      await setLoadingNotification(true);
      await userNotificationRepository
        .list({
          ...notificationFilter,
          skip: notificationFilter.skip + 10,
        })
        .subscribe((res) => {
          setNotifications([...notifications, ...res]);
        });
      await setNotificationFilter({
        ...notificationFilter,
        skip: notificationFilter.skip + 10,
      });
      await setLoadingNotification(false);
    };
    fetch();
  }, [total, notificationFilter, notifications]);

  const handleToggerGateway = React.useCallback(() => {
    setGatewayDropDown(!gatewayDropDown);
  }, [gatewayDropDown]);

  const handleClick = React.useCallback(
    (project: string) => {
      return () => {
        // ev.preventDefault();
        if (
          state?.user &&
          state?.user.appUserSiteMappings &&
          state?.user.appUserSiteMappings.length > 0
        ) {
          state?.user.appUserSiteMappings.map((item: AppUserSiteMapping) => {
            if (item.site.code === project) {
              window.location.href = `${item.site.code}`;
            }
            return window.location.href;
          });
          return;
        }
      };
    },
    [state]
  );

  const handleToggerProfile = React.useCallback(() => {
    setProfileDrop(!profileDrop);
  }, [profileDrop]);

  const handleMouseLeaveAll = React.useCallback(() => {
    setGatewayDropDown(false);
    setNotificationDropDown(false);
    setProfileDrop(false);
  }, []);
  const handleReadNotification = React.useCallback(
    (id: number, url: string) => {
      return async () => {
        // ev.preventDefault();
        await userNotificationRepository.read(id);
        await fetchUnreadNotification();
        window.location.href = url;
      };
    },
    [fetchUnreadNotification]
  );

  function buildAbsoluteLink(url: string | null | undefined | number) {
    if (url === null || typeof url === "undefined") {
      return "#";
    }
    return path.join("/", url.toString());
  }

  return {
    handleLogout,
    handleClickToProfile,
    handleClickToChangePassword,
    handleClickToNotification,
    handleToggleNotification,
    notificationDropDown,
    notifications,
    hasMore,
    total,
    loadingNotification,
    handleInfiniteOnLoad,
    handleToggerGateway,
    gatewayDropDown,
    handleClick,
    handleToggerProfile,
    profileDrop,
    handleMouseLeaveAll,
    handleReadNotification,
    buildAbsoluteLink,
    unreadNotification,
  };
}
