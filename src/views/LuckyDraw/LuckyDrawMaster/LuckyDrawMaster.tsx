import { Card, Spin, Tabs } from "antd";

import React from "react";
import "./LuckyDrawMaster.scss";
import star from "../../../assets/images/icon/star.svg";
import { luckyDrawService } from "../LuckyDrawHook";
import { LUCKY_DRAW_MASTER_ROUTE, LUCKY_DRAW_ROUTE } from "config/route-consts";
import { LuckyDraw, LuckyDrawFilter } from "models/LuckyDraw";
import { luckyDrawRepository } from "repositories/lucky-draw-repository";
import masterService from "services/pages/master-service";
import Pagination from "components/Utility/Pagination/Pagination";
import LuckyDrawDetailModal from "../LuckyDrawDetail/LuckyDrawDetailModal";
import { limitWord } from "helpers/string";
import { useHistory, useLocation } from "react-router";
import path from "path";
const { TabPane } = Tabs;
const { Meta } = Card;

function LuckyDrawMaster() {
  const history = useHistory();
  const { search } = useLocation();
  // const location = useLocation();
  const [
    handleGoPlayZone,
    ,
    handleGoPlayHistory,
  ] = luckyDrawService.useLuckyDrawNavigation(LUCKY_DRAW_ROUTE);

  const {
    repo,
    handleTabChange: handleClickTab,
  } = luckyDrawService.useRepository(luckyDrawRepository);
  const {
    list,
    total,
    loadingList,
    filter,
    handlePagination,
    handleUpdateNewFilter,
  } = masterService.useMaster<LuckyDraw, LuckyDrawFilter>(
    LuckyDrawFilter,
    "",
    repo.list,
    repo.count,
    null,
    null
  );

  const handleTabChange = React.useCallback(
    (activeKey: string) => {
      handleClickTab(activeKey);
      const currentFilter = { ...filter };
      currentFilter["tabNumber"] = activeKey;
      currentFilter["skip"] = 0;
      handleUpdateNewFilter(currentFilter);
    },
    [handleClickTab, filter, handleUpdateNewFilter]
  );

  const handleFormatHTMLDescription = React.useCallback(
    (htmlString: string) => {
      var content = htmlString
        .replace(/<img[^>]*>/g, "")
        .replace("<strong>", "<b>")
        .replace("</strong>", "</b>");
      return content;
    },
    []
  );

  const [isViewDetail, setIsViewDetail] = React.useState<boolean>(false);
  const [currentPreview, setCurrentPreview] = React.useState<LuckyDraw>(
    new LuckyDraw()
  );
  const handleGoDetail = React.useCallback(
    (id: number) => {
      history.push(path.join(LUCKY_DRAW_MASTER_ROUTE + search + "#" + id));
      luckyDrawRepository.get(id).subscribe((luckyDraw: LuckyDraw) => {
        setCurrentPreview(luckyDraw);
        setIsViewDetail(true);
      });
    },
    [history, search]
  );

  const handleClosePreview = React.useCallback(() => {
    setIsViewDetail(false);
    history.push(path.join(LUCKY_DRAW_MASTER_ROUTE + search));
  }, [history, search]);

  luckyDrawService.usePopupQuery(handleGoDetail);

  return (
    <div
      style={{ paddingLeft: "36px", paddingTop: "40px" }}
      className={"lucky-draw__master"}
    >
      <div className={"lucky-draw__title"}>Vui chơi có thưởng!!</div>
      <Tabs
        defaultActiveKey="1"
        activeKey={filter["tabNumber"] ? filter["tabNumber"] : "1"}
        onTabClick={handleTabChange}
      >
        <TabPane tab="Đang diễn ra" key="1">
          <Pagination
            skip={filter.skip}
            take={filter.take}
            total={total}
            onChange={handlePagination}
            style={{ margin: "10px" }}
          />
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            {!loadingList ? (
              list &&
              list.map((luckyDraw: LuckyDraw) => (
                <Card
                  hoverable
                  style={{ width: "324px", borderRadius: "16px" }}
                  cover={
                    <img
                      width="auto"
                      height="206px"
                      alt={luckyDraw?.avatarImage?.name}
                      style={{ objectFit: "cover" }}
                      src={
                        luckyDraw?.avatarImage?.url
                          ? luckyDraw?.avatarImage?.url
                          : require("../../../assets/images/box-image.svg")
                      }
                      onError={(e) => {
                        const image = e.target as HTMLImageElement;
                        image.src = require("../../../assets/images/box-image.svg");
                      }}
                    />
                  }
                  className={"lucky-draw__item--wrapper"}
                  key={luckyDraw?.id}
                >
                  <Meta
                    title={limitWord(luckyDraw?.name, 55)}
                    description={
                      <div className={"lucky-draw__description--wrapper"}>
                        {" "}
                        <span style={{ textDecoration: "underline" }}>
                          Thể lệ tham dự
                        </span>
                        <span>: </span>
                        <p
                          className="mt-3 lucky-draw__description--content"
                          contentEditable="false"
                          dangerouslySetInnerHTML={{
                            __html: handleFormatHTMLDescription(
                              luckyDraw?.description
                            ),
                          }}
                        ></p>
                        <span> </span>
                        <span
                          style={{
                            textDecoration: "underline",
                            color: "#00a8f0",
                          }}
                          onClick={() => handleGoDetail(luckyDraw?.id)}
                        >
                          chi tiết
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginTop: "16px",
                          }}
                        >
                          <img src={star} alt=""></img>
                          <div
                            className={
                              luckyDraw?.remainingTurnCounter > 0
                                ? "lucky-draw__description--turns"
                                : "lucky-draw__description--no-turns"
                            }
                          >
                            {luckyDraw?.remainingTurnCounter > 0
                              ? `Có ${luckyDraw?.remainingTurnCounter} lượt`
                              : `Không có lượt nào!`}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                            marginTop: "24px",
                          }}
                        >
                          <button
                            className={
                              "btn lucky-draw__btn lucky-draw__btn--play-now"
                            }
                            onClick={() => handleGoPlayZone(luckyDraw?.id)}
                            disabled={luckyDraw?.remainingTurnCounter === 0}
                          >
                            <span className="component_btn-text">
                              {"Chơi ngay"}
                            </span>
                          </button>

                          <button
                            className={
                              "btn lucky-draw__btn lucky-draw__btn--my-history"
                            }
                            onClick={() => handleGoPlayHistory(luckyDraw?.id)}
                          >
                            <span className="component_btn-text">
                              {"Giải của tôi"}
                            </span>
                          </button>
                        </div>
                      </div>
                    }
                  />
                </Card>
              ))
            ) : (
              <div className="loading-block">
                <Spin tip="Loading..." />
              </div>
            )}
          </div>
        </TabPane>
        <TabPane tab="Đã kết thúc" key="2">
          <Pagination
            skip={filter.skip}
            take={filter.take}
            total={total}
            onChange={handlePagination}
            style={{ margin: "10px" }}
          />
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            {!loadingList ? (
              list &&
              list.map((luckyDraw: LuckyDraw) => (
                <Card
                  hoverable
                  style={{ width: "324px", borderRadius: "16px" }}
                  cover={
                    <img
                      width="auto"
                      height="206px"
                      alt={luckyDraw?.avatarImage?.name}
                      style={{ objectFit: "cover" }}
                      src={
                        luckyDraw?.avatarImage?.url
                          ? luckyDraw?.avatarImage?.url
                          : require("../../../assets/images/box-image.svg")
                      }
                      onError={(e) => {
                        const image = e.target as HTMLImageElement;
                        image.src = require("../../../assets/images/box-image.svg");
                      }}
                    />
                  }
                  className={"lucky-draw__item--wrapper"}
                  key={luckyDraw?.id}
                >
                  <Meta
                    title={limitWord(luckyDraw?.name, 55)}
                    description={
                      <div className={"lucky-draw__description--wrapper"}>
                        {" "}
                        <span style={{ textDecoration: "underline" }}>
                          Thể lệ tham dự
                        </span>
                        <span>: </span>
                        <p
                          className="mt-3 lucky-draw__description--content"
                          contentEditable="false"
                          dangerouslySetInnerHTML={{
                            __html: handleFormatHTMLDescription(
                              luckyDraw?.description
                            ),
                          }}
                        ></p>
                        <span> </span>
                        <span
                          style={{
                            textDecoration: "underline",
                            color: "#00a8f0",
                          }}
                          onClick={() => handleGoDetail(luckyDraw?.id)}
                        >
                          chi tiết
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginTop: "16px",
                          }}
                        >
                          <img src={star} alt=""></img>
                          <div className={"lucky-draw__description--no-turns"}>
                            Chương trình đã kết thúc!
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                            marginTop: "24px",
                          }}
                        >
                          <button
                            className={
                              "btn lucky-draw__btn lucky-draw__btn--play-now"
                            }
                            disabled
                          >
                            <span className="component_btn-text">
                              {"Chơi ngay"}
                            </span>
                          </button>

                          <button
                            className={
                              "btn lucky-draw__btn lucky-draw__btn--my-history"
                            }
                            onClick={() => handleGoPlayHistory(luckyDraw?.id)}
                          >
                            <span className="component_btn-text">
                              {"Giải của tôi"}
                            </span>
                          </button>
                        </div>
                      </div>
                    }
                  />
                </Card>
              ))
            ) : (
              <div className="loading-block">
                <Spin tip="Loading..." />
              </div>
            )}
          </div>
        </TabPane>
      </Tabs>
      <LuckyDrawDetailModal
        visible={isViewDetail}
        model={currentPreview}
        setVisible={setIsViewDetail}
        tabNumber={filter["tabNumber"] ? filter["tabNumber"] : 1}
        handleClosePreview={handleClosePreview}
      />
    </div>
  );
}

export default LuckyDrawMaster;
