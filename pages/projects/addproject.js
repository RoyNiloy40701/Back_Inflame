import { SiBloglovin } from "react-icons/fa";
import { Project } from "@/models/Project";

export default function Addproject() {

    return <>
        <div className="addblogspage">
            <div className="titledashboard flex flex-sb">
                <div>
                    <h2>
                        Add <span>Projrct</span>
                    </h2>
                    <h3>ADMIN PANNEL</h3>
                </div>
                <div clasName="breadcrumb">
                    <SiBloglovin />
                    <span>/</span> <span>Add Project </span>
                </div>
            </div>
            <div className="blogsadd"></div>
            <Project />
        </div>
    </>
}