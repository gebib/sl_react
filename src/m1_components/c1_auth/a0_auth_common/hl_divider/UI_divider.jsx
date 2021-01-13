import React, { useState } from "react";
import {useTranslation} from "react-i18next/src";
import "./ST_divider.scss";

export const UI_divider = (props) => {
    const {t, i18n} = useTranslation("SL_languages");
    const textToShow = props.middleText;

    return (
        <div className="text-hr text-hr--center">
            <span className="text-hr__text">{textToShow}</span>
        </div>
    );
}