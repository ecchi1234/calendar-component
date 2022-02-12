import React from 'react';
import { storiesOf } from "@storybook/react";
import { FileType } from './FileType';
import nameof from "ts-nameof.macro";

function Default() {
    return <FileType />;
}

storiesOf('FileType', module)
  .add(nameof(Default), Default);