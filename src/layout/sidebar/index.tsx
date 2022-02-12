/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { ArrowRight, ArrowLeft, Grid } from "react-feather";
import { Link } from "react-router-dom";
import configDB from "../../data/customizer/config";
import { MenuItem, Menu } from "../../config/menu";
import { MenuContext } from "app/app-context";

const Sidebar = (props) => {
  const menu = useContext<Menu[]>(MenuContext);
  const [mainmenu, setMainMenu] = useState(menu);
  const [margin, setMargin] = useState(0);
  const [width, setWidth] = useState(0);
  const [sidebartoogle, setSidebartoogle] = useState(true);

  const wrapper =
    useSelector((content: any) => content.Customizer.sidebar_types.type) ||
    configDB.data.settings.sidebar.type;

  useEffect(() => {
    document.querySelector(".left-arrow").classList.add("d-none");

    window.addEventListener("resize", handleResize);
    handleResize();

    const currentUrl = window.location.pathname;
    const tmp = currentUrl.split("/");
    const currentPath = tmp[2] + "/";
    const internalMenu = [...menu];
    internalMenu.map((items) => {
      items.Items.filter((Items) => {
        if (Items.path && Items.path.includes(currentPath)) setNav(Items, loop);
        if (!Items.children) return false;
        Items.children.filter((subItems) => {
          if (subItems.path && subItems.path.includes(currentPath)) {
            setNav(subItems, loop);
          }
          if (!subItems.children) return false;
          subItems.children.filter((subSubItems) => {
            if (subSubItems.path && subSubItems.path.includes(currentPath)) {
              setNav(subSubItems, loop);
              return true;
            } else {
              return false;
            }
          });
          return subItems;
        });
        return Items;
      });
      return items;
    });
    setMainMenu(internalMenu);

    return () => {
      window.removeEventListener("resize", handleResize);
    };

    // eslint-disable-next-line
  }, [menu]);

  const handleResize = () => {
    setWidth(window.innerWidth - 500);
  };
  // recursion loop for click event
  const loop2 = React.useCallback((list, item) => {
    list.forEach((e) => {
      if (list.includes(item)) {
        if (e.path === item.path) {
          e.active = true;
        } else {
          e.active = false;
        }
      }
      if (!e.children) return false;
      loop2(e.children, item);
    });
  }, []);

  // recursion find element
  const recursionFind = React.useCallback((list, item) => {
    return list.find((menuItem) => {
      if (menuItem.path === item.path) {
        return true;
      } else {
        if (!menuItem.children) return false;
        return recursionFind(menuItem.children, item);
      }
    });
  }, []);

  // recursion loop for refresh event
  const loop = React.useCallback(
    (list, item) => {
      // eslint-disable-next-line array-callback-return
      list.filter((e) => {
        if (e.type === "link") {
          if (e.path === item.path) {
            e.active = true;
            return true;
          } else {
            e.active = false;
            return false;
          }
        } else if (e.type === "sub") {
          if (!e.children) return false;
          if (recursionFind(e.children, item)) {
            e.active = true;
          }
          loop(e.children, item);
        }
      });
    },
    [recursionFind]
  );

  // custom subnav
  const setNav = (item: MenuItem, custom_loop) => {
    if (window.innerWidth <= 991) {
      document.querySelector(".page-header").className =
        "page-header close_icon";
      document.querySelector(".sidebar-wrapper").className =
        "sidebar-wrapper close_icon ";
      document
        .querySelector(".mega-menu-container")
        .classList.remove("d-block");
      if (item.type === "sub") {
        document.querySelector(".page-header").className = "page-header ";
        document.querySelector(".sidebar-wrapper").className =
          "sidebar-wrapper ";
      }
    }

    const menus = [...menu];
    if (!item.active) {
      menus.map((a) => {
        custom_loop(a.Items, item);
        return a;
      });
    } else {
      if (item.type === "sub") {
        item.active = false;
      }
    }

    setMainMenu(menus);
  };

  const scrollToRight = () => {
    if (margin <= -2598 || margin <= -2034) {
      if (width === 492) {
        setMargin(-3570);
      } else {
        setMargin(-3464);
      }
      document.querySelector(".right-arrow").classList.add("d-none");
      document.querySelector(".left-arrow").classList.remove("d-none");
    } else {
      setMargin((margin) => (margin += -width));
      document.querySelector(".left-arrow").classList.remove("d-none");
    }
  };

  const scrollToLeft = () => {
    if (margin >= -width) {
      setMargin(0);
      document.querySelector(".left-arrow").classList.add("d-none");
      document.querySelector(".right-arrow").classList.remove("d-none");
    } else {
      setMargin((margin) => (margin += width));
      document.querySelector(".right-arrow").classList.remove("d-none");
    }
  };

  const openCloseSidebar = (toggle) => {
    if (toggle) {
      setSidebartoogle(!toggle);
      document.querySelector(".page-header").className =
        "page-header close_icon";
      document.querySelector(".sidebar-wrapper").className =
        "sidebar-wrapper close_icon ";
    } else {
      setSidebartoogle(!toggle);
      document.querySelector(".page-header").className = "page-header";
      document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper ";
    }
  };

  const responsiveSidebar = () => {
    document.querySelector(".page-header").className = "page-header close_icon";
    document.querySelector(".sidebar-wrapper").className =
      "sidebar-wrapper close_icon";
  };

  return (
    <Fragment>
      <div className="sidebar-wrapper">
        <div className="logo-wrapper">
          <Link to={`${process.env.PUBLIC_URL}/dashboard/default`}>
            <img
              className="img-fluid for-light"
              src={require("../../assets/images/logo/logo.png")}
              alt=""
            />
            <img
              className="img-fluid for-dark"
              src={require("../../assets/images/logo/logo_dark.png")}
              alt=""
            />
          </Link>
          <div className="back-btn" onClick={() => responsiveSidebar()}>
            <i className="fa fa-angle-left"></i>
          </div>
          <div
            className="toggle-sidebar"
            onClick={() => openCloseSidebar(sidebartoogle)}
          >
            <Grid className="status_toggle middle sidebar-toggle" />
          </div>
        </div>
        <div className="logo-icon-wrapper">
          <Link to={`${process.env.PUBLIC_URL}/dashboard/default`}>
            <img
              className="img-fluid"
              src={require("../../assets/images/logo/logo-icon.png")}
              alt=""
            />
          </Link>
        </div>
        <nav className="sidebar-main">
          <div className="left-arrow" onClick={scrollToLeft}>
            <ArrowLeft />
          </div>
          <div
            id="sidebar-menu"
            style={
              wrapper === "horizontal-wrapper"
                ? { marginLeft: margin + "px" }
                : { margin: "0px" }
            }
          >
            <ul className="sidebar-links custom-scrollbar">
              <li className="back-btn">
                <div className="mobile-back text-right">
                  <span>{"Back"}</span>
                  <i className="fa fa-angle-right pl-2" aria-hidden="true"></i>
                </div>
              </li>
              {mainmenu.map((Item, i) => (
                <Fragment key={i}>
                  <li className="sidebar-main-title">
                    <div>
                      <h6 className="lan-1">{Item.menutitle}</h6>
                      <p className="lan-2">{Item.menucontent}</p>
                    </div>
                  </li>
                  {Item.Items.map((menuItem: MenuItem, i) => {
                    return (
                      <li className="sidebar-list" key={i}>
                        {menuItem.type === "sub" ? (
                          <a
                            className={`sidebar-link sidebar-title  ${
                              menuItem.active ? "active" : ""
                            }`}
                            onClick={() => {
                              setNav(menuItem, loop2);
                            }}
                          >
                            {menuItem.icon}
                            <span>{menuItem.title}</span>
                            {menuItem.badge ? (
                              <label className={menuItem.badge}>
                                {menuItem.badgetxt}
                              </label>
                            ) : (
                              ""
                            )}
                            <div className="according-menu">
                              {menuItem.active ? (
                                <i className="fa fa-angle-down"></i>
                              ) : (
                                <i className="fa fa-angle-right"></i>
                              )}
                            </div>
                          </a>
                        ) : (
                          ""
                        )}

                        {menuItem.type === "link" ? (
                          <Link
                            to={menuItem.path}
                            className={`sidebar-link sidebar-title link-nav text-overflow  ${
                              menuItem.active ? "active" : ""
                            }`}
                            onClick={() => setNav(menuItem, loop2)}
                          >
                            {menuItem.icon}
                            <span>{menuItem.title}</span>
                            {menuItem.badge ? (
                              <label className={menuItem.badge}>
                                {menuItem.badgetxt}
                              </label>
                            ) : (
                              ""
                            )}
                          </Link>
                        ) : (
                          ""
                        )}

                        {menuItem.children ? (
                          <ul
                            className="sidebar-submenu"
                            style={
                              menuItem.active
                                ? sidebartoogle
                                  ? {
                                      opacity: 1,
                                      transition: "opacity 500ms ease-in",
                                    }
                                  : { display: "block" }
                                : { display: "none" }
                            }
                          >
                            {menuItem.children.map((childrenItem, index) => {
                              return (
                                <li key={index}>
                                  {childrenItem.type === "sub" ? (
                                    <a
                                      className={`${
                                        childrenItem.active ? "active" : ""
                                      }`}
                                      onClick={() => {
                                        if (wrapper !== "horizontal-wrapper")
                                          setNav(childrenItem, loop2);
                                      }}
                                    >
                                      {childrenItem.title}
                                      <span className="sub-arrow">
                                        <i className="fa fa-chevron-right"></i>
                                      </span>
                                      <div className="according-menu">
                                        {childrenItem.active ? (
                                          <i className="fa fa-angle-down"></i>
                                        ) : (
                                          <i className="fa fa-angle-right"></i>
                                        )}
                                      </div>
                                    </a>
                                  ) : (
                                    ""
                                  )}

                                  {childrenItem.type === "link" ? (
                                    <Link
                                      to={childrenItem.path}
                                      className={`${
                                        childrenItem.active ? "active" : ""
                                      }`}
                                      onClick={() => setNav(childrenItem, loop)}
                                    >
                                      {childrenItem.title}
                                    </Link>
                                  ) : (
                                    ""
                                  )}

                                  {childrenItem.type === "exteral_link" ? (
                                    <a href={childrenItem.path}>
                                      {childrenItem.title}
                                    </a>
                                  ) : (
                                    ""
                                  )}

                                  {childrenItem.children ? (
                                    <ul
                                      className="nav-sub-childmenu submenu-content"
                                      style={
                                        childrenItem.active &&
                                        wrapper !== "horizontal-wrapper"
                                          ? { display: "block" }
                                          : { display: "none" }
                                      }
                                    >
                                      {childrenItem.children.map(
                                        (childrenSubItem, key) => (
                                          <li key={key}>
                                            {childrenSubItem.type === "link" ? (
                                              <Link
                                                to={childrenSubItem.path}
                                                className={`${
                                                  childrenSubItem.active
                                                    ? "active"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  setNav(childrenSubItem, loop)
                                                }
                                              >
                                                {childrenSubItem.title}
                                              </Link>
                                            ) : (
                                              ""
                                            )}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          ""
                        )}
                      </li>
                    );
                  })}
                </Fragment>
              ))}
            </ul>
          </div>
          <div className="right-arrow" onClick={scrollToRight}>
            <ArrowRight />
          </div>
        </nav>
      </div>
    </Fragment>
  );
};

export default Sidebar;
