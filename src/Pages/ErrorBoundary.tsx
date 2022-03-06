import React from "react";
import CompactNav from "../Components/CompactNav/CompactNav";
import Redirect from "../Components/Redirect/Redirect";

export class ErrorBoundary extends React.Component<any, any>{
    constructor(props: any) {
        super(props);

        this.state = { hasError: false }

    }
    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service

    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            //  this.state.setAlertData({ ... this.state.alertData, message: "Downloading data from server." })
            return (
                <Redirect to="/priorities" message="Synchronizing with server." />
            )
        }

        return this.props.children;
    }
}