import { storiesOf } from "@storybook/react";
import React from "react";
import nameof from "ts-nameof.macro";
import AdvanceUploadFile, { UPLOADTYPE } from "./AdvanceUploadFile";

const menu = [
  {
    path:
      "https://media.discordapp.net/attachments/663753852184428596/847406738138595348/7ab2cd69-80fe-4106-ba8d-218d78b131d4.png",
    isDelete: true,
    name: "demoImage1.png",
    id: 1,
  },
  {
    path:
      "https://media.discordapp.net/attachments/663753852184428596/847406738138595348/7ab2cd69-80fe-4106-ba8d-218d78b131d4.png",
    isDelete: true,
    name: "demoImage2.png",
    id: 2,
  },
  {
    path:
      "https://media.discordapp.net/attachments/663753852184428596/847406738138595348/7ab2cd69-80fe-4106-ba8d-218d78b131d4.png",
    isDelete: true,
    name: "demoImage3.png",
    id: 3,
  },
];

function Default() {
  return (
    <div style={{ margin: "20px 20px", width: "600px" }}>
      <div style={{ width: "100%", padding: "10px 10px" }}>
        <AdvanceUploadFile
          files={[]}
          type={UPLOADTYPE.IMAGE}
          isMultiple={false}
          size="large"
        ></AdvanceUploadFile>
      </div>
      <div style={{ width: "100%", padding: "10px 10px" }}>
        <AdvanceUploadFile
          files={menu}
          type={UPLOADTYPE.IMAGE}
          isMultiple={false}
          size="normal"
        ></AdvanceUploadFile>
      </div>
      <div style={{ width: "100%", padding: "10px 10px" }}>
        <AdvanceUploadFile
          files={menu}
          type={UPLOADTYPE.IMAGE}
          isMultiple={false}
          size="small"
        ></AdvanceUploadFile>
      </div>
      <div style={{ width: "100%", padding: "10px 10px" }}>
        <AdvanceUploadFile
          files={menu}
          type={UPLOADTYPE.IMAGE}
          isMultiple={false}
          size="smaller"
        ></AdvanceUploadFile>
      </div>
      <div style={{ width: "100%", padding: "10px 10px", display: "flex" }}>
        <div style={{ marginRight: 20 }}>
          <AdvanceUploadFile files={menu} type={UPLOADTYPE.IMAGE}></AdvanceUploadFile>
        </div>
        <div>
          <AdvanceUploadFile
            files={menu}
            type={UPLOADTYPE.IMAGE}
            isMinimized={true}
          ></AdvanceUploadFile>
        </div>
        <div>
          <AdvanceUploadFile
            files={[]}
            type={UPLOADTYPE.IMAGE}
            isMinimized={true}
          ></AdvanceUploadFile>
        </div>
      </div>
    </div>
  );
}

storiesOf("AdvanceUploadFile", module).add(nameof(Default), Default);
