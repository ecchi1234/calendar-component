import { storiesOf } from "@storybook/react";
import React from "react";
import nameof from "ts-nameof.macro";
import FroalaEditor from "./FroalaEditor";

function Default() {
  const [value, setValue] = React.useState<string>("");

  return (
    <>
      <div style={{ margin: "10px" }}>
        <FroalaEditor value={value} onChange={setValue} />
      </div>
    </>
  );
}

storiesOf("FroalaEditor", module).add(nameof(Default), Default);
