import { useMemo, useState } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import HomeTab from "./ribbonTabViews/HomeTab";
import InsertTab from "./ribbonTabViews/InsertTab";
import FileTab from "./ribbonTabViews/FileTab";
import DrawTab from "./ribbonTabViews/DrawTab";
import ViewTab from "./ribbonTabViews/ViewTab";
import Arrow_No_Tail from "../images/Arrow_No_Tail.svg";
import Pencil from "../images/Pencil.svg";
import Share_Icon from "../images/Share_Icon.svg";
import "../styles/ribbon.css";

const tabs = [
    'File',
    'Home',
    'Insert',
    'Draw',
    'View',
]

const tabViews: any = {
    FileTab,
    HomeTab,
    InsertTab,
    DrawTab,
    ViewTab,
}

interface RibbonProps {
    state: RibbonState;
    editorRef: React.MutableRefObject<TinyMCEEditor | undefined>;
    setState: React.Dispatch<React.SetStateAction<RibbonState>>;
}

export default function Ribbon(props: RibbonProps) {

    // Tab state
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(1);
    const TabView = useMemo(() => {
        const tabName = tabs[selectedTabIndex];
        return tabViews[`${tabName}Tab`];
    }, [selectedTabIndex])


    return <div className="ribbon">
        <div className="ribbon-top">
            <div className="tabs">
                {
                    tabs.map((tab, index) =>
                        <div
                            key={index}
                            className={`${tab.toLowerCase()} tab ${selectedTabIndex === index ? 'selected' : ''}`}
                            onClick={() => setSelectedTabIndex(index)}>
                            {tab}
                        </div>
                    )
                }
                <div className="select-indicator-wrapper" style={{ transform: `translateX(${selectedTabIndex * 64}px)` }}>
                    <div className="select-indicator"></div>
                </div>
            </div>
            <div className="status flex-center-vertical gap-12">
                <div className="editing-btn btn pad-8 flex-center-vertical gap-8">
                    <img src={Pencil} className="size-18-18" />
                    <span>Editing</span>
                    <img src={Arrow_No_Tail} className="size-10-10" style={{ rotate: '180deg'}}/>
                </div>
                <div className="share-btn btn pad-8 flex-center-vertical gap-8">
                    <img src={Share_Icon} className="size-18-18"/>
                    <span>Share</span>
                    <img src={Arrow_No_Tail} className="size-10-10" style={{ rotate: '180deg'}}/>
                </div>
            </div>
        </div>
        <div className="ribbon-bottom">
            <div className="tools">
                {TabView && <TabView {...props} />}
            </div>
        </div>
    </div>
}