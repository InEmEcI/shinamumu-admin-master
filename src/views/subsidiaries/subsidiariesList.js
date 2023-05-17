import React, {Component} from "react";
import DataTable from "./DataTable/dataTable";

export default class SubsidiariesList extends Component {
    render() {
        return (
            <div>
                <DataTable history={this.props.history}/>
            </div>
        )
    }
}

