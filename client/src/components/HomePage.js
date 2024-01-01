import React from "react";
import Navigation from "./Navigation";
import {Link} from "react-router-dom"

export default function homepage() {
    return(<div id = 'homepage'>
        {Navigation}
    </div>);
}