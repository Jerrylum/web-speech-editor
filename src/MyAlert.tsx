import { Alert, AlertColor } from "@mui/material";
import React from "react";

export interface IMyAlertParameter {severity: string, message: string}

export class MyAlert extends React.Component<{data: IMyAlertParameter}, {}> {
    constructor(props: {data: IMyAlertParameter}) {
        super(props);
    }

    render(): React.ReactNode {
        return ( <Alert severity={this.props.data.severity as AlertColor}>{this.props.data.message}</Alert> );
    }
};