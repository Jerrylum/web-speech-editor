import { Alert, AlertColor } from "@mui/material";
import React from "react";

export interface IMyAlertParameter { severity: string, message: string }

export class MyAlert extends React.Component<{ data: IMyAlertParameter }, {}> {
    render(): React.ReactNode {
        return (
            <Alert severity={this.props.data.severity as AlertColor}>
                <span dangerouslySetInnerHTML={{ __html: this.props.data.message }}></span>
            </Alert>
        );
    }
};