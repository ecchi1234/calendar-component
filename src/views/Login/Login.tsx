import { Input } from "antd";
import FormItem from "antd/lib/form/FormItem";
import Spin from "antd/lib/spin";
import { AppUser } from "models/AppUser/AppUser";
import React, { useState } from "react";
import nameof from "ts-nameof.macro";
import "./Login.scss";
import useLogin from "./LoginService";

function Login() {
  const [appUser, setAppUser] = useState<AppUser>({
    ...new AppUser(),
    username: "",
    password: "",
  });
  const [errorMessageUsername, setErrorMessageUsername] = useState<string>(
    null
  );
  const [errorMessagePass, setErrorMessagePass] = useState<string>(null);

  const [errorMessageStatus, setErrorMessageStatus] = useState<string>(null);

  const [handleLogin, handleChangeField, handleEnter, loading] = useLogin(
    appUser,
    setAppUser,
    setErrorMessageUsername,
    setErrorMessagePass,
    setErrorMessageStatus
  );

  return (
    <>
      <div className="login-page">
        {/* <BackGround /> */}
        <div className="login-box">
          <div className="flex-container flex-container-row">
            {/* <div className="flex-item mr-3 mt-5">
              <div className="gateway">
                <img className="mt-5" src="assets/img/brand/portal-login.png" alt={'noImage'} />
              </div>
            </div> */}
            <div className="flex-item">
              <div className="title gateway">
                <img
                  className="mt-5"
                  src={require("../../assets/images/logo-white.svg")}
                  alt={"noImage"}
                />
                <div className="title-content mt-1">
                  {" "}
                  <img
                    src={require("../../assets/images/Vuesax.svg")}
                    alt={"noImage"}
                  />
                </div>
              </div>
              <div className="login-frame">
                <Spin spinning={loading}>
                  {true && (
                    <div className="login-content">
                      {/* errors */}
                      <div className="login-content__title">Đăng nhập</div>
                      <div className="user-name">
                        <FormItem>
                          <Input
                            type="text"
                            value={appUser.username}
                            placeholder="Nhập tên đăng nhập"
                            onKeyDown={handleEnter}
                            autoComplete={"off"}
                            onChange={handleChangeField(
                              nameof(appUser.username)
                            )}
                            style={{
                              padding: "12px 16px",
                              borderRadius: "4px",
                              height: "40px",
                            }}
                            prefix={
                              <img
                                src={require("assets/images/icon/Profile.svg")}
                                alt="profile"
                                width="15px"
                                height="15px"
                                style={{ marginRight: "19px" }}
                              />
                            }
                          />
                          {errorMessageUsername !== null && (
                            <div className="login-error mt-1 p-1">
                              {errorMessageUsername}
                            </div>
                          )}
                          {errorMessageStatus !== null && (
                            <div className="login-error mt-1 p-1">
                              {errorMessageStatus}
                            </div>
                          )}
                        </FormItem>
                      </div>
                      <div className="password mt-4">
                        <FormItem>
                          <Input
                            type="password"
                            value={appUser.password}
                            placeholder="Nhập mật khẩu"
                            onKeyDown={handleEnter}
                            onChange={handleChangeField(
                              nameof(appUser.password)
                            )}
                            prefix={
                              <img
                                src={require("assets/images/icon/Lock.svg")}
                                alt="password"
                                width="15px"
                                height="15px"
                                style={{ marginRight: "19px" }}
                              />
                            }
                            style={{
                              padding: "12px 16px",
                              borderRadius: "4px",
                              height: "40px",
                            }}
                          />
                          {errorMessagePass !== null && (
                            <div className="login-error mt-1 p-1">
                              {errorMessagePass}
                            </div>
                          )}
                        </FormItem>
                      </div>

                      <div className="action-login">
                        <div className="login d-flex w-100">
                          <button
                            className="btn btn-primary btn-sm btn-login"
                            onClick={handleLogin}
                            disabled={
                              errorMessagePass !== null ||
                              errorMessageUsername !== null
                            }
                          >
                            Đăng nhập
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
